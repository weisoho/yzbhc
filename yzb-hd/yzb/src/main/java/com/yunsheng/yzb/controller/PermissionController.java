package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.config.annotation.RequiresPermission;
import com.yunsheng.yzb.model.SysPermission;
import com.yunsheng.yzb.service.PermissionService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.vo.PermissionTreeVO;
import com.yunsheng.yzb.vo.UserPermissionVO;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 权限管理控制器
 */
@RestController
@RequestMapping("/api/permission")
public class PermissionController {

    @Resource
    private PermissionService permissionService;

    /**
     * 获取当前用户权限信息
     */
    @GetMapping("/current")
    public AjaxResult getCurrentUserPermissions() {
        Integer userId = LoginCacheUtil.getCurrentUserId();
        if (userId == null) {
            return AjaxResult.res(0, "未登录", null);
        }
        UserPermissionVO permissions = permissionService.getUserPermissions(userId);
        return AjaxResult.successInstance(permissions);
    }

    /**
     * 获取当前用户菜单树
     */
    @GetMapping("/menu/tree")
    public AjaxResult getUserMenuTree() {
        Integer userId = LoginCacheUtil.getCurrentUserId();
        if (userId == null) {
            return AjaxResult.res(0, "未登录", null);
        }
        List<PermissionTreeVO> menuTree = permissionService.getUserMenuTree(userId);
        return AjaxResult.successInstance(menuTree);
    }

    /**
     * 获取所有权限树
     */
    @GetMapping("/tree")
    @RequiresPermission("system:permission:query")
    public AjaxResult getAllPermissionTree() {
        List<PermissionTreeVO> tree = permissionService.getAllPermissionTree();
        return AjaxResult.successInstance(tree);
    }

    /**
     * 根据角色ID获取权限列表
     */
    @GetMapping("/role/{roleId}")
    @RequiresPermission("system:permission:query")
    public AjaxResult getPermissionsByRoleId(@PathVariable Long roleId) {
        List<SysPermission> permissions = permissionService.getPermissionsByRoleId(roleId);
        return AjaxResult.successInstance(permissions);
    }

    /**
     * 创建权限
     */
    @PostMapping
    @RequiresPermission("system:permission:add")
    public AjaxResult createPermission(@RequestBody SysPermission permission) {
        permission.setCreateBy(LoginCacheUtil.getCurrentUserId());
        int result = permissionService.createPermission(permission);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新权限
     */
    @PutMapping("/{id}")
    @RequiresPermission("system:permission:edit")
    public AjaxResult updatePermission(@PathVariable Long id, @RequestBody SysPermission permission) {
        permission.setId(id);
        permission.setUpdateBy(LoginCacheUtil.getCurrentUserId());
        int result = permissionService.updatePermission(permission);
        if (result > 0) {
            return AjaxResult.successInstance("更新成功");
        }
        return AjaxResult.errorInstance("更新失败");
    }

    /**
     * 删除权限
     */
    @DeleteMapping("/{id}")
    @RequiresPermission("system:permission:delete")
    public AjaxResult deletePermission(@PathVariable Long id) {
        int result = permissionService.deletePermission(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }

    /**
     * 批量删除权限
     */
    @DeleteMapping("/batch")
    @RequiresPermission("system:permission:delete")
    public AjaxResult deletePermissions(@RequestBody List<Long> ids) {
        int result = permissionService.deletePermissions(ids);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }
}
