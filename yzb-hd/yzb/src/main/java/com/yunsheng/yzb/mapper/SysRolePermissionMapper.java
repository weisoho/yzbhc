package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysRolePermission;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 角色权限关联Mapper接口
 */
public interface SysRolePermissionMapper {

    /**
     * 根据角色ID查询权限关联
     */
    List<SysRolePermission> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据权限ID查询角色关联
     */
    List<SysRolePermission> selectByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 插入角色权限关联
     */
    int insert(SysRolePermission rolePermission);

    /**
     * 批量插入角色权限关联
     */
    int insertBatch(@Param("list") List<SysRolePermission> list);

    /**
     * 删除角色的所有权限
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 删除权限的所有角色
     */
    int deleteByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 删除指定角色权限关联
     */
    int delete(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
}
