package com.yunsheng.yzb.service.impl;

import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.mapper.SysPermissionMapper;
import com.yunsheng.yzb.mapper.SysRoleMapper;
import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.model.SysPermission;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.service.PermissionService;
import com.yunsheng.yzb.vo.PermissionTreeVO;
import com.yunsheng.yzb.vo.UserPermissionVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 权限服务实现类
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    @Resource
    private SysPermissionMapper permissionMapper;

    @Resource
    private SysRoleMapper roleMapper;

    @Resource
    private SysDepartmentMapper departmentMapper;

    @Override
    public UserPermissionVO getUserPermissions(Integer userId) {
        UserPermissionVO vo = new UserPermissionVO();
        vo.setUserId(userId);

        // 获取用户角色
        List<SysRole> roles = roleMapper.selectByUserId(userId);
        Set<String> roleCodes = roles.stream()
                .map(SysRole::getRoleCode)
                .collect(Collectors.toSet());
        vo.setRoleCodes(roleCodes);

        // 获取用户权限
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        Set<String> permissionCodes = permissions.stream()
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toSet());
        vo.setPermissionCodes(permissionCodes);

        // 获取菜单树
        vo.setMenuTree(getUserMenuTree(userId));

        // 获取按钮权限
        vo.setButtonPermissions(getUserButtonPermissions(userId));

        // 获取数据权限范围（取最大权限）
        Integer dataScope = roles.stream()
                .map(SysRole::getDataScope)
                .min(Integer::compareTo)
                .orElse(4); // 默认仅本人
        vo.setDataScope(dataScope);

        // 如果是自定义数据权限，获取部门ID列表
        if (dataScope == 5) {
            Set<Integer> deptIds = new HashSet<>();
            for (SysRole role : roles) {
                if (role.getDataScope() == 5) {
                    List<SysDepartment> departments = departmentMapper.selectByRoleId(role.getId());
                    deptIds.addAll(departments.stream().map(SysDepartment::getId).collect(Collectors.toSet()));
                }
            }
            vo.setCustomDeptIds(deptIds);
        }

        return vo;
    }

    @Override
    public List<PermissionTreeVO> getUserMenuTree(Integer userId) {
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        // 只保留菜单类型
        List<SysPermission> menus = permissions.stream()
                .filter(p -> p.getPermissionType() == 1)
                .collect(Collectors.toList());
        return buildPermissionTree(menus, 0L);
    }

    @Override
    public Set<String> getUserButtonPermissions(Integer userId) {
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        return permissions.stream()
                .filter(p -> p.getPermissionType() == 2) // 按钮类型
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toSet());
    }

    @Override
    public List<PermissionTreeVO> getAllPermissionTree() {
        List<SysPermission> permissions = permissionMapper.selectAll();
        return buildPermissionTree(permissions, 0L);
    }

    @Override
    public List<SysPermission> getPermissionsByRoleId(Long roleId) {
        return permissionMapper.selectByRoleId(roleId);
    }

    @Override
    public boolean hasPermission(Integer userId, String permissionCode) {
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        return permissions.stream()
                .anyMatch(p -> p.getPermissionCode().equals(permissionCode));
    }

    @Override
    public boolean hasAnyPermission(Integer userId, String... permissionCodes) {
        if (permissionCodes == null || permissionCodes.length == 0) {
            return false;
        }
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        Set<String> userPermissions = permissions.stream()
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toSet());
        return Arrays.stream(permissionCodes).anyMatch(userPermissions::contains);
    }

    @Override
    public boolean hasAllPermissions(Integer userId, String... permissionCodes) {
        if (permissionCodes == null || permissionCodes.length == 0) {
            return true;
        }
        List<SysPermission> permissions = permissionMapper.selectByUserId(userId);
        Set<String> userPermissions = permissions.stream()
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toSet());
        return Arrays.stream(permissionCodes).allMatch(userPermissions::contains);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int createPermission(SysPermission permission) {
        return permissionMapper.insert(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int updatePermission(SysPermission permission) {
        return permissionMapper.updateById(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deletePermission(Long id) {
        return permissionMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deletePermissions(List<Long> ids) {
        return permissionMapper.deleteBatch(ids);
    }

    /**
     * 构建权限树
     */
    private List<PermissionTreeVO> buildPermissionTree(List<SysPermission> permissions, Long parentId) {
        List<PermissionTreeVO> tree = new ArrayList<>();
        for (SysPermission permission : permissions) {
            if (permission.getParentId().equals(parentId)) {
                PermissionTreeVO node = new PermissionTreeVO();
                BeanUtils.copyProperties(permission, node);
                node.setName(permission.getPermissionName());
                node.setCode(permission.getPermissionCode());
                node.setType(permission.getPermissionType());
                
                List<PermissionTreeVO> children = buildPermissionTree(permissions, permission.getId());
                if (!children.isEmpty()) {
                    node.setChildren(children);
                }
                tree.add(node);
            }
        }
        tree.sort(Comparator.comparing(PermissionTreeVO::getSortOrder));
        return tree;
    }
}
