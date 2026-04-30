package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysDepartment;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 部门 Mapper 接口。
 */
public interface SysDepartmentMapper {

    /**
     * 根据 ID 查询部门。
     */
    SysDepartment selectById(@Param("id") Long id);

    /**
     * 查询所有部门。
     */
    List<SysDepartment> selectAll();

    /**
     * 根据父级 ID 查询子部门。
     */
    List<SysDepartment> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 根据角色 ID 查询自定义数据权限部门。
     */
    List<SysDepartment> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 新增部门。
     */
    int insert(SysDepartment department);

    /**
     * 更新部门。
     */
    int updateById(SysDepartment department);

    /**
     * 删除部门，逻辑删除。
     */
    int deleteById(@Param("id") Long id);
}

