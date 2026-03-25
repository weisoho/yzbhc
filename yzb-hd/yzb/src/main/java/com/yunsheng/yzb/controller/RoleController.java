package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.config.annotation.RequiresPermission;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.service.RoleService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;

/**
 * 角色管理
 */
@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Resource
    private RoleService roleService;

    /**
     * 查询所有角色
     */
    @GetMapping("/list")
    @RequiresPermission("system:role:query")
    public AjaxResult<List<SysRole>> getAllRoles() {
        List<SysRole> roles = roleService.getAllRoles();
        return AjaxResult.successInstance(roles);
    }

    /**
     * 根据ID查询角色
     */
    @GetMapping("/{id}")
    @RequiresPermission("system:role:query")
    public AjaxResult<SysRole> getRoleById(@PathVariable Long id) {
        SysRole role = roleService.getRoleById(id);
        if (role != null) {
            return AjaxResult.successInstance(role);
        }
        return AjaxResult.res(0, "角色不存在", null);
    }

    /**
     * 根据用户ID查询角色列表
     */
    @GetMapping("/user/{userId}")
    @RequiresPermission("system:role:query")
    public AjaxResult<List<SysRole>> getRolesByUserId(@PathVariable Integer userId) {
        List<SysRole> roles = roleService.getRolesByUserId(userId);
        return AjaxResult.successInstance(roles);
    }

    /**
     * 创建角色
     */
    @PostMapping
    @RequiresPermission("system:role:add")
    public AjaxResult<String> createRole(@RequestBody SysRole role) {
        role.setCreateBy(LoginCacheUtil.getCurrentUserId());
        int result = roleService.createRole(role);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新角色
     * @param id 用户id
     * @param role　角色
     */
    @PutMapping("/{id}")
    @RequiresPermission("system:role:edit")
    public AjaxResult<String> updateRole(@PathVariable Long id, @RequestBody SysRole role) {
        role.setId(id);
        role.setUpdateBy(LoginCacheUtil.getCurrentUserId());
        int result = roleService.updateRole(role);
        if (result > 0) {
            return AjaxResult.successInstance("更新成功");
        }
        return AjaxResult.errorInstance("更新失败");
    }

    /**
     * 删除角色
     * @param id 用户id
     */
    @DeleteMapping("/{id}")
    @RequiresPermission("system:role:delete")
    public AjaxResult<String> deleteRole(@PathVariable Long id) {
        int result = roleService.deleteRole(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }

    /**
     * 为角色分配权限
     * @param roleId 角色ID
     * @param permissionIds 权限id集合
     */
    @PostMapping("/{roleId}/permissions")
    @RequiresPermission("system:role:assign")
    public AjaxResult<String> assignPermissions(@PathVariable Long roleId, @RequestBody List<Long> permissionIds) {
        Integer operatorId = LoginCacheUtil.getCurrentUserId();
        int result = roleService.assignPermissions(roleId, permissionIds, operatorId);
        if (result >= 0) {
            return AjaxResult.successInstance("分配成功");
        }
        return AjaxResult.errorInstance("分配失败");
    }

    /**
     * 查询角色已分配的数据权限部门ID。
     */
    @GetMapping("/{roleId}/departments")
    @RequiresPermission("system:role:query")
    public AjaxResult<Set<Long>> getRoleDepartments(@PathVariable Long roleId) {
        return AjaxResult.successInstance(roleService.getDepartmentIdsByRoleId(roleId));
    }

    /**
     * 为角色分配数据权限部门。
     */
    @PostMapping("/{roleId}/departments")
    @RequiresPermission("system:role:assign")
    public AjaxResult<String> assignDepartments(@PathVariable Long roleId, @RequestBody List<Long> deptIds) {
        int result = roleService.assignDepartments(roleId, deptIds);
        if (result >= 0) {
            return AjaxResult.successInstance("分配成功");
        }
        return AjaxResult.errorInstance("分配失败");
    }

    /**
     * 为用户分配角色
     * @param userId 用户id
     * @param roleIds 角色id集合
     */
    @PostMapping("/user/{userId}/roles")
    @RequiresPermission("system:user:assign")
    public AjaxResult<String> assignRolesToUser(@PathVariable Integer userId, @RequestBody List<Long> roleIds) {
        Integer operatorId = LoginCacheUtil.getCurrentUserId();
        int result = roleService.assignRolesToUser(userId, roleIds, operatorId);
        if (result >= 0) {
            return AjaxResult.successInstance("分配成功");
        }
        return AjaxResult.errorInstance("分配失败");
    }
}
