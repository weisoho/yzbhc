package com.yunsheng.yzb.service.impl;

import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.mapper.SysRoleDeptMapper;
import com.yunsheng.yzb.mapper.SysRoleMapper;
import com.yunsheng.yzb.mapper.SysRolePermissionMapper;
import com.yunsheng.yzb.mapper.SysUserRoleMapper;
import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.model.SysRoleDept;
import com.yunsheng.yzb.model.SysRolePermission;
import com.yunsheng.yzb.model.SysUserRole;
import com.yunsheng.yzb.service.RoleService;
import com.yunsheng.yzb.utils.DepartmentTreeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 角色服务实现类
 */
@Service
public class RoleServiceImpl implements RoleService {

    private static final Set<String> RESERVED_ROLE_CODES = Set.of("SUPER_ADMIN", "ADMIN");

    @Autowired
    private SysRoleMapper roleMapper;

    @Autowired
    private SysUserRoleMapper userRoleMapper;

    @Autowired
    private SysRolePermissionMapper rolePermissionMapper;

    @Autowired
    private SysRoleDeptMapper roleDeptMapper;

    @Autowired
    private SysDepartmentMapper departmentMapper;

    @Override
    public SysRole getRoleById(Long id) {
        return roleMapper.selectById(id);
    }

    @Override
    public List<SysRole> getAllRoles() {
        return roleMapper.selectAll();
    }

    @Override
    public List<SysRole> getRolesByUserId(Integer userId) {
        return roleMapper.selectByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int createRole(SysRole role) {
        // 检查角色编码是否已存在
        SysRole existingRole = roleMapper.selectByRoleCode(role.getRoleCode());
        if (existingRole != null) {
            throw new RuntimeException("角色编码已存在");
        }
        return roleMapper.insert(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int updateRole(SysRole role) {
        ensureRoleEditable(role.getId());
        return roleMapper.updateById(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deleteRole(Long id) {
        ensureRoleEditable(id);
        // 删除角色
        int result = roleMapper.deleteById(id);
        // 删除角色权限关联
        rolePermissionMapper.deleteByRoleId(id);
        // 删除用户角色关联
        userRoleMapper.deleteByRoleId(id);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int assignPermissions(Long roleId, List<Long> permissionIds, Integer operatorId) {
        ensureRoleEditable(roleId);
        // 先删除原有权限
        rolePermissionMapper.deleteByRoleId(roleId);
        
        // 批量插入新权限
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<SysRolePermission> list = permissionIds.stream()
                    .map(permissionId -> {
                        SysRolePermission rp = new SysRolePermission();
                        rp.setRoleId(roleId);
                        rp.setPermissionId(permissionId);
                        rp.setCreateBy(operatorId);
                        return rp;
                    })
                    .collect(Collectors.toList());
            return rolePermissionMapper.insertBatch(list);
        }
        return 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int assignRolesToUser(Integer userId, List<Long> roleIds, Integer operatorId) {
        ensureUserRoleAssignmentAllowed(userId, roleIds, operatorId);

        // 先删除原有角色
        userRoleMapper.deleteByUserId(userId);
        
        // 批量插入新角色
        if (roleIds != null && !roleIds.isEmpty()) {
            List<SysUserRole> list = roleIds.stream()
                    .map(roleId -> {
                        SysUserRole ur = new SysUserRole();
                        ur.setUserId(userId);
                        ur.setRoleId(roleId);
                        ur.setCreateBy(operatorId);
                        return ur;
                    })
                    .collect(Collectors.toList());
            return userRoleMapper.insertBatch(list);
        }
        return 0;
    }

    @Override
    public Set<Long> getDepartmentIdsByRoleId(Long roleId) {
        List<SysRoleDept> roleDepts = roleDeptMapper.selectByRoleId(roleId);
        if (roleDepts == null || roleDepts.isEmpty()) {
            return Collections.emptySet();
        }
        return roleDepts.stream()
                .map(SysRoleDept::getDeptId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int assignDepartments(Long roleId, List<Long> deptIds) {
        ensureRoleEditable(roleId);
        roleDeptMapper.deleteByRoleId(roleId);
        if (deptIds == null || deptIds.isEmpty()) {
            return 0;
        }

        List<SysDepartment> allDepartments = departmentMapper.selectAll();
        Set<Long> expandedDeptIds = DepartmentTreeUtils.expandWithDescendants(deptIds, allDepartments);
        if (expandedDeptIds.isEmpty()) {
            return 0;
        }

        List<SysRoleDept> list = expandedDeptIds.stream()
                .map(deptId -> {
                    SysRoleDept roleDept = new SysRoleDept();
                    roleDept.setRoleId(roleId);
                    roleDept.setDeptId(deptId);
                    return roleDept;
                })
                .collect(Collectors.toList());
        return roleDeptMapper.insertBatch(list);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int removeUserRole(Integer userId, Long roleId) {
        return userRoleMapper.delete(userId, roleId);
    }

    @Override
    public boolean hasRole(Integer userId, String roleCode) {
        List<SysRole> roles = roleMapper.selectByUserId(userId);
        return roles.stream().anyMatch(r -> r.getRoleCode().equals(roleCode));
    }

    @Override
    public boolean hasAnyRole(Integer userId, String... roleCodes) {
        if (roleCodes == null || roleCodes.length == 0) {
            return false;
        }
        List<SysRole> roles = roleMapper.selectByUserId(userId);
        Set<String> userRoles = roles.stream()
                .map(SysRole::getRoleCode)
                .collect(Collectors.toSet());
        return Arrays.stream(roleCodes).anyMatch(userRoles::contains);
    }

    private void ensureRoleEditable(Long roleId) {
        if (roleId == null) {
            return;
        }
        SysRole role = roleMapper.selectById(roleId);
        if (isReservedRole(role)) {
            throw new RuntimeException("系统保留角色不允许修改");
        }
    }

    private void ensureUserRoleAssignmentAllowed(Integer userId, List<Long> roleIds, Integer operatorId) {
        List<SysRole> currentRoles = roleMapper.selectByUserId(userId);
        if (isSuperAdminUser(currentRoles) && !hasSuperAdminRole(operatorId)) {
            throw new RuntimeException("非超级管理员不允许操作超级管理员账号");
        }

        ensureSelfProtectedRolesRetained(userId, roleIds, operatorId, currentRoles);

        boolean protectedUser = currentRoles.stream().anyMatch(this::isSuperAdminRole);
        if (!protectedUser) {
            return;
        }

        boolean retainedProtectedRole = roleIds != null && roleIds.stream()
                .map(roleMapper::selectById)
                .anyMatch(this::isSuperAdminRole);
        if (!retainedProtectedRole) {
            throw new RuntimeException("超级管理员用户必须保留超级管理员角色");
        }
    }

    private void ensureSelfProtectedRolesRetained(Integer userId,
                                                  List<Long> roleIds,
                                                  Integer operatorId,
                                                  List<SysRole> currentRoles) {
        if (userId == null || !userId.equals(operatorId)) {
            return;
        }

        Set<Long> assignedRoleIds = roleIds == null ? Collections.emptySet() : new LinkedHashSet<>(roleIds);
        List<SysRole> currentProtectedRoles = currentRoles.stream()
                .filter(this::isSuperAdminRole)
                .collect(Collectors.toList());
        for (SysRole protectedRole : currentProtectedRoles) {
            if (!assignedRoleIds.contains(protectedRole.getId())) {
                throw new RuntimeException("当前登录用户不允许撤销自己的超级管理员角色");
            }
        }
    }

    private boolean hasSuperAdminRole(Integer userId) {
        return isSuperAdminUser(roleMapper.selectByUserId(userId));
    }

    private boolean isSuperAdminUser(List<SysRole> roles) {
        return roles != null && roles.stream().anyMatch(this::isSuperAdminRole);
    }

    private boolean isReservedRole(SysRole role) {
        return role != null && RESERVED_ROLE_CODES.contains(String.valueOf(role.getRoleCode()).toUpperCase());
    }

    private boolean isSuperAdminRole(SysRole role) {
        return role != null && "SUPER_ADMIN".equalsIgnoreCase(String.valueOf(role.getRoleCode()));
    }
}
