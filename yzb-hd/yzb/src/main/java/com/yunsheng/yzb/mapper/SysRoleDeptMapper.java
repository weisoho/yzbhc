package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysRoleDept;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色部门数据权限关联 Mapper。
 */
public interface SysRoleDeptMapper {

    /**
     * 根据角色ID查询部门关联。
     */
    List<SysRoleDept> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 批量插入角色部门关联。
     */
    int insertBatch(@Param("list") List<SysRoleDept> list);

    /**
     * 删除角色的所有部门数据权限。
     */
    int deleteByRoleId(@Param("roleId") Long roleId);
}

