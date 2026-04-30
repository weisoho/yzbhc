package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.config.annotation.RequiresPermission;
import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.YsUserExample;
import com.yunsheng.yzb.service.RoleService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.vo.UserManagementVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private YsUserMapper ysUserMapper;

    @Autowired
    private RoleService roleService;

    @Autowired
    private SysDepartmentMapper departmentMapper;

    /**
     * 获取用户列表
     */
    @GetMapping("/list")
    @RequiresPermission("system:user:query")
    public AjaxResult<List<UserManagementVO>> getUserList() {
        YsUserExample example = new YsUserExample();
        List<YsUser> userList = ysUserMapper.selectByExample(example);
        return AjaxResult.successInstance(userList.stream()
                .map(this::buildUserManagementVO)
                .collect(Collectors.toList()));
    }

    /**
     * 根据ID获取用户
     */
    @GetMapping("/{id}")
    @RequiresPermission("system:user:query")
    public AjaxResult<UserManagementVO> getUserById(@PathVariable Integer id) {
        YsUser user = ysUserMapper.selectByPrimaryKey(id);
        if (user != null) {
            return AjaxResult.successInstance(buildUserManagementVO(user));
        }
        return AjaxResult.res(0, "用户不存在", null);
    }

    /**
     * 创建用户
     */
    @PostMapping
    @RequiresPermission("system:user:add")
    public AjaxResult<String> createUser(@RequestBody YsUser user) {
        String departmentValidationMessage = validateUserDepartmentScope(user.getDepId());
        if (departmentValidationMessage != null) {
            return AjaxResult.res(0, departmentValidationMessage, null);
        }

        populateDepartmentName(user);

        // 检查用户名是否已存在
        YsUserExample example = new YsUserExample();
        example.createCriteria().andUserNameEqualTo(user.getUserName());
        List<YsUser> existingUsers = ysUserMapper.selectByExample(example);
        if (!existingUsers.isEmpty()) {
            return AjaxResult.res(0, "用户名已存在", null);
        }

        // 设置默认值
        user.setCreateTime(new Date());
        user.setUpdateTime(new Date());
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
            if (user.getDepId() == null) {
                return AjaxResult.res(0, "请选择所属部门", null);
            }

        int result = ysUserMapper.insert(user);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    @RequiresPermission("system:user:edit")
    public AjaxResult<String> updateUser(@PathVariable Integer id, @RequestBody YsUser user) {
        YsUser existingUser = ysUserMapper.selectByPrimaryKey(id);
        if (existingUser == null) {
            return AjaxResult.res(0, "用户不存在", null);
        }

        Integer targetDepId = user.getDepId() != null ? user.getDepId() : existingUser.getDepId();
        String departmentValidationMessage = validateUserDepartmentScope(targetDepId);
        if (departmentValidationMessage != null) {
            return AjaxResult.res(0, departmentValidationMessage, null);
        }

        if (user.getUserName() != null && !user.getUserName().equals(existingUser.getUserName())) {
            YsUserExample example = new YsUserExample();
            example.createCriteria().andUserNameEqualTo(user.getUserName());
            if (!ysUserMapper.selectByExample(example).isEmpty()) {
                return AjaxResult.res(0, "用户名已存在", null);
            }
        }

        user.setId(id);
        populateDepartmentName(user);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("更新成功");
        }
        return AjaxResult.errorInstance("更新失败");
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @RequiresPermission("system:user:delete")
    public AjaxResult<String> deleteUser(@PathVariable Integer id) {
        int result = ysUserMapper.deleteByPrimaryKey(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }

    /**
     * 切换用户状态
     */
    @PutMapping("/{id}/status")
    @RequiresPermission("system:user:edit")
    public AjaxResult<String> toggleUserStatus(@PathVariable Integer id, @RequestBody Integer status) {
        YsUser user = new YsUser();
        user.setId(id);
        user.setStatus(status);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("状态更新成功");
        }
        return AjaxResult.errorInstance("状态更新失败");
    }

    /**
     * 修改密码
     */
    @PutMapping("/{id}/password")
    @RequiresPermission("system:user:edit")
    public AjaxResult<String> updatePassword(@PathVariable Integer id, @RequestBody String newPassword) {
        String normalizedPassword = normalizePassword(newPassword);
        if (normalizedPassword == null || normalizedPassword.trim().isEmpty()) {
            return AjaxResult.res(0, "新密码不能为空", null);
        }
        YsUser user = new YsUser();
        user.setId(id);
        user.setPassword(normalizedPassword);
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("密码更新成功");
        }
        return AjaxResult.errorInstance("密码更新失败");
    }

    /**
     * 重置密码
     */
    @PutMapping("/{id}/password/reset")
    @RequiresPermission("system:user:edit")
    public AjaxResult<String> resetPassword(@PathVariable Integer id) {
        YsUser user = new YsUser();
        user.setId(id);
        user.setPassword("000000"); // 默认密码
        user.setUpdateTime(new Date());

        int result = ysUserMapper.updateByPrimaryKeySelective(user);
        if (result > 0) {
            return AjaxResult.successInstance("密码重置成功");
        }
        return AjaxResult.errorInstance("密码重置失败");
    }

    /**
     * 检查用户名是否已存在
     */
    @GetMapping("/check-username")
    @RequiresPermission(value = {"system:user:add", "system:user:edit"}, logical = RequiresPermission.Logical.OR)
    public AjaxResult<Boolean> checkUsernameExists(@RequestParam String username,
                                                   @RequestParam(required = false) Integer excludeId) {
        YsUserExample example = new YsUserExample();
        example.createCriteria().andUserNameEqualTo(username);
        List<YsUser> existingUsers = ysUserMapper.selectByExample(example);
        boolean exists = existingUsers.stream().anyMatch(user -> !user.getId().equals(excludeId));
        return AjaxResult.successInstance(exists);
    }

    private UserManagementVO buildUserManagementVO(YsUser user) {
        UserManagementVO vo = new UserManagementVO();
        BeanUtils.copyProperties(user, vo, "password", "userToken");
        List<SysRole> roles = roleService.getRolesByUserId(user.getId());
        vo.setRoleIds(roles.stream().map(SysRole::getId).collect(Collectors.toList()));
        vo.setRoleNames(roles.stream().map(SysRole::getRoleName).collect(Collectors.toList()));
        return vo;
    }

    private String validateUserDepartmentScope(Integer targetDeptId) {
        if (targetDeptId == null) {
            return "请选择所属部门";
        }

        SysDepartment targetDepartment = departmentMapper.selectById(targetDeptId.longValue());
        if (targetDepartment == null || Objects.equals(targetDepartment.getIsDeleted(), 1)) {
            return "所属部门不存在";
        }

        Integer operatorId = LoginCacheUtil.getCurrentUserId();
        if (operatorId == null) {
            return "当前登录信息已失效，请重新登录";
        }

        if (roleService.hasRole(operatorId, "SUPER_ADMIN")) {
            return null;
        }

        YsUser operator = ysUserMapper.selectByPrimaryKey(operatorId);
        if (operator == null || operator.getDepId() == null) {
            return "当前操作人未绑定部门，无法分配用户院区";
        }

        Long operatorCampusId = resolveCampusId(operator.getDepId());
        Long targetCampusId = resolveCampusId(targetDeptId);
        if (operatorCampusId == null || targetCampusId == null) {
            return "无法识别所属院区，请检查部门树配置";
        }
        if (!operatorCampusId.equals(targetCampusId)) {
            return "当前账号只能管理本院区的用户";
        }
        return null;
    }

    private Long resolveCampusId(Integer deptId) {
        if (deptId == null) {
            return null;
        }

        List<SysDepartment> departments = departmentMapper.selectAll();
        Map<Long, SysDepartment> departmentMap = departments.stream()
                .collect(Collectors.toMap(dept -> dept.getId().longValue(), Function.identity(), (left, right) -> left));

        Long currentId = deptId.longValue();
        while (currentId != null) {
            SysDepartment currentDepartment = departmentMap.get(currentId);
            if (currentDepartment == null) {
                return null;
            }
            if ("CAMPUS".equalsIgnoreCase(currentDepartment.getOrgType()) || Objects.equals(currentDepartment.getParentId(), 0)) {
                return currentDepartment.getId().longValue();
            }
            currentId = currentDepartment.getParentId() == null ? null : currentDepartment.getParentId().longValue();
        }
        return null;
    }

    private void populateDepartmentName(YsUser user) {
        if (user.getDepId() == null) {
            return;
        }
        SysDepartment department = departmentMapper.selectById(user.getDepId().longValue());
        if (department != null) {
            user.setUserDep(department.getDeptName());
        }
    }

    private String normalizePassword(String rawPassword) {
        if (rawPassword == null) {
            return null;
        }
        String password = rawPassword.trim();
        if (password.startsWith("\"") && password.endsWith("\"") && password.length() >= 2) {
            password = password.substring(1, password.length() - 1);
        }
        return password;
    }
}