package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 角色Mapper接口
 */
@Mapper
public interface SysRoleMapper {

    /**
     * 根据ID查询角色
     */
    SysRole selectById(@Param("id") Long id);

    /**
     * 根据角色编码查询
     */
    SysRole selectByRoleCode(@Param("roleCode") String roleCode);

    /**
     * 查询所有角色
     */
    List<SysRole> selectAll();

    /**
     * 根据用户ID查询角色列表
     */
    List<SysRole> selectByUserId(@Param("userId") Integer userId);

    /**
     * 插入角色
     */
    int insert(SysRole role);

    /**
     * 更新角色
     */
    int updateById(SysRole role);

    /**
     * 删除角色（逻辑删除）
     */
    int deleteById(@Param("id") Long id);

    /**
     * 批量删除角色
     */
    int deleteBatch(@Param("ids") List<Long> ids);
}
