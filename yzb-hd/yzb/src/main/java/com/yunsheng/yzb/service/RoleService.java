package com.yunsheng.yzb.service;

import com.yunsheng.yzb.model.SysRole;
import java.util.List;

/**
 * 角色服务接口
 */
public interface RoleService {

    /**
     * 根据ID查询角色
     */
    SysRole getRoleById(Long id);

    /**
     * 查询所有角色
     */
    List<SysRole> getAllRoles();

    /**
     * 根据用户ID查询角色列表
     */
    List<SysRole> getRolesByUserId(Integer userId);

    /**
     * 创建角色
     */
    int createRole(SysRole role);

    /**
     * 更新角色
     */
    int updateRole(SysRole role);

    /**
     * 删除角色
     */
    int deleteRole(Long id);

    /**
     * 为角色分配权限
     */
    int assignPermissions(Long roleId, List<Long> permissionIds, Integer operatorId);

    /**
     * 为用户分配角色
     */
    int assignRolesToUser(Integer userId, List<Long> roleIds, Integer operatorId);

    /**
     * 移除用户角色
     */
    int removeUserRole(Integer userId, Long roleId);

    /**
     * 检查用户是否有指定角色
     */
    boolean hasRole(Integer userId, String roleCode);

    /**
     * 检查用户是否有任一角色
     */
    boolean hasAnyRole(Integer userId, String... roleCodes);
}
