package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SysDepartment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 部门Mapper接口
 */
@Mapper
public interface SysDepartmentMapper {

    /**
     * 根据ID查询部门
     */
    SysDepartment selectById(@Param("id") Long id);

    /**
     * 查询所有部门
     */
    List<SysDepartment> selectAll();

    /**
     * 根据父ID查询子部门
     */
    List<SysDepartment> selectByParentId(@Param("parentId") Long parentId);

    /**
     * 根据角色ID查询自定义数据权限部门
     */
    List<SysDepartment> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 插入部门
     */
    int insert(SysDepartment department);

    /**
     * 更新部门
     */
    int updateById(SysDepartment department);

    /**
     * 删除部门（逻辑删除）
     */
    int deleteById(@Param("id") Long id);
}
