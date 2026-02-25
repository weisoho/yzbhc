package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysUserRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 用户角色关联Mapper接口
 */
@Mapper
public interface SysUserRoleMapper {

    /**
     * 根据用户ID查询角色关联
     */
    List<SysUserRole> selectByUserId(@Param("userId") Integer userId);

    /**
     * 根据角色ID查询用户关联
     */
    List<SysUserRole> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 插入用户角色关联
     */
    int insert(SysUserRole userRole);

    /**
     * 批量插入用户角色关联
     */
    int insertBatch(@Param("list") List<SysUserRole> list);

    /**
     * 删除用户的所有角色
     */
    int deleteByUserId(@Param("userId") Integer userId);

    /**
     * 删除角色的所有用户
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 删除指定用户角色关联
     */
    int delete(@Param("userId") Integer userId, @Param("roleId") Long roleId);
}
