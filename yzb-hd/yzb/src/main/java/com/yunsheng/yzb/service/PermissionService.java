package com.yunsheng.yzb.service;

import com.yunsheng.yzb.model.SysPermission;
import com.yunsheng.yzb.vo.PermissionTreeVO;
import com.yunsheng.yzb.vo.UserPermissionVO;
import java.util.List;
import java.util.Set;

/**
 * 权限服务接口
 */
public interface PermissionService {

    /**
     * 获取用户权限信息
     */
    UserPermissionVO getUserPermissions(Integer userId);

    /**
     * 获取用户菜单树
     */
    List<PermissionTreeVO> getUserMenuTree(Integer userId);

    /**
     * 获取用户按钮权限
     */
    Set<String> getUserButtonPermissions(Integer userId);

    /**
     * 获取所有权限树
     */
    List<PermissionTreeVO> getAllPermissionTree();

    /**
     * 根据角色ID获取权限列表
     */
    List<SysPermission> getPermissionsByRoleId(Long roleId);

    /**
     * 检查用户是否有指定权限
     */
    boolean hasPermission(Integer userId, String permissionCode);

    /**
     * 检查用户是否有任一权限
     */
    boolean hasAnyPermission(Integer userId, String... permissionCodes);

    /**
     * 检查用户是否有所有权限
     */
    boolean hasAllPermissions(Integer userId, String... permissionCodes);

    /**
     * 创建权限
     */
    int createPermission(SysPermission permission);

    /**
     * 更新权限
     */
    int updatePermission(SysPermission permission);

    /**
     * 删除权限
     */
    int deletePermission(Long id);

    /**
     * 批量删除权限
     */
    int deletePermissions(List<Long> ids);
}
