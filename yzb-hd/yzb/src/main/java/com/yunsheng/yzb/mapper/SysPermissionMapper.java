package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 权限Mapper接口
 */
@Mapper
public interface SysPermissionMapper {

    /**
     * 根据ID查询权限
     */
    SysPermission selectById(@Param("id") Long id);

    /**
     * 查询所有权限
     */
    List<SysPermission> selectAll();

    /**
     * 根据用户ID查询权限列表
     */
    List<SysPermission> selectByUserId(@Param("userId") Integer userId);

    /**
     * 根据角色ID查询权限列表
     */
    List<SysPermission> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据权限类型查询
     */
    List<SysPermission> selectByType(@Param("permissionType") Integer permissionType);

    /**
     * 根据父ID查询子权限
     */
    List<SysPermission> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 插入权限
     */
    int insert(SysPermission permission);

    /**
     * 更新权限
     */
    int updateById(SysPermission permission);

    /**
     * 删除权限（逻辑删除）
     */
    int deleteById(@Param("id") Long id);

    /**
     * 批量删除权限
     */
    int deleteBatch(@Param("ids") List<Long> ids);
}
