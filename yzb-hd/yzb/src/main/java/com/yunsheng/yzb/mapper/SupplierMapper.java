package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.Supplier;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 供应商 Mapper 接口
 */
public interface SupplierMapper {
    /**
     * 根据主键删除供应商
     * @param id 供应商ID
     * @return 影响行数
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * 插入供应商（全字段）
     * @param record 供应商实体
     * @return 影响行数
     */
    int insert(Supplier record);

    /**
     * 插入供应商（可选字段）
     * @param record 供应商实体
     * @return 影响行数
     */
    int insertSelective(Supplier record);

    /**
     * 根据主键查询供应商
     * @param id 供应商ID
     * @return 供应商实体
     */
    Supplier selectByPrimaryKey(Integer id);

    /**
     * 根据主键更新供应商（可选字段）
     * @param record 供应商实体
     * @return 影响行数
     */
    int updateByPrimaryKeySelective(Supplier record);

    /**
     * 根据主键更新供应商（全字段）
     * @param record 供应商实体
     * @return 影响行数
     */
    int updateByPrimaryKey(Supplier record);

    /**
     * 查询供应商列表（支持模糊查询）
     * @param name 供应商名称（模糊查询）
     * @param contactPerson 联系人（模糊查询）
     * @param contactPhone 联系电话（模糊查询）
     * @return 供应商列表
     */
    List<Supplier> selectByCondition(@Param("name") String name, 
                                   @Param("contactPerson") String contactPerson, 
                                   @Param("contactPhone") String contactPhone);
}
