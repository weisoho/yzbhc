package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.config.annotation.RequiresPermission;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.service.RoleService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 角色管理控制器
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
    public AjaxResult getAllRoles() {
        List<SysRole> roles = roleService.getAllRoles();
        return AjaxResult.successInstance(roles);
    }

    /**
     * 根据ID查询角色
     */
    @GetMapping("/{id}")
    @RequiresPermission("system:role:query")
    public AjaxResult getRoleById(@PathVariable Long id) {
        SysRole role = roleService.getRoleById(id);
        if (role != null) {
            return AjaxResult.successInstance(role);
        }
        return AjaxResult.errorInstance("角色不存在");
    }

    /**
     * 根据用户ID查询角色列表
     */
    @GetMapping("/user/{userId}")
    @RequiresPermission("system:role:query")
    public AjaxResult getRolesByUserId(@PathVariable Integer userId) {
        List<SysRole> roles = roleService.getRolesByUserId(userId);
        return AjaxResult.successInstance(roles);
    }

    /**
     * 创建角色
     */
    @PostMapping
    @RequiresPermission("system:role:add")
    public AjaxResult createRole(@RequestBody SysRole role) {
        role.setCreateBy(LoginCacheUtil.getCurrentUserId());
        int result = roleService.createRole(role);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新角色
     */
    @PutMapping("/{id}")
    @RequiresPermission("system:role:edit")
    public AjaxResult updateRole(@PathVariable Long id, @RequestBody SysRole role) {
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
     */
    @DeleteMapping("/{id}")
    @RequiresPermission("system:role:delete")
    public AjaxResult deleteRole(@PathVariable Long id) {
        int result = roleService.deleteRole(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }

    /**
     * 为角色分配权限
     */
    @PostMapping("/{roleId}/permissions")
    @RequiresPermission("system:role:assign")
    public AjaxResult assignPermissions(@PathVariable Long roleId, @RequestBody List<Long> permissionIds) {
        Integer operatorId = LoginCacheUtil.getCurrentUserId();
        int result = roleService.assignPermissions(roleId, permissionIds, operatorId);
        if (result >= 0) {
            return AjaxResult.successInstance("分配成功");
        }
        return AjaxResult.errorInstance("分配失败");
    }

    /**
     * 为用户分配角色
     */
    @PostMapping("/user/{userId}/roles")
    @RequiresPermission("system:user:assign")
    public AjaxResult assignRolesToUser(@PathVariable Integer userId, @RequestBody List<Long> roleIds) {
        Integer operatorId = LoginCacheUtil.getCurrentUserId();
        int result = roleService.assignRolesToUser(userId, roleIds, operatorId);
        if (result >= 0) {
            return AjaxResult.successInstance("分配成功");
        }
        return AjaxResult.errorInstance("分配失败");
    }
}
