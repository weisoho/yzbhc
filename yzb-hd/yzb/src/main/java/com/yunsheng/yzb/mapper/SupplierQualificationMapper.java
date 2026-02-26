package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SupplierQualification;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 供应商资质 Mapper 接口
 */
public interface SupplierQualificationMapper {
    /**
     * 根据主键删除资质
     * @param id 资质ID
     * @return 影响行数
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * 插入资质（全字段）
     * @param record 资质实体
     * @return 影响行数
     */
    int insert(SupplierQualification record);

    /**
     * 插入资质（可选字段）
     * @param record 资质实体
     * @return 影响行数
     */
    int insertSelective(SupplierQualification record);

    /**
     * 根据主键查询资质
     * @param id 资质ID
     * @return 资质实体
     */
    SupplierQualification selectByPrimaryKey(Integer id);

    /**
     * 根据主键更新资质（可选字段）
     * @param record 资质实体
     * @return 影响行数
     */
    int updateByPrimaryKeySelective(SupplierQualification record);

    /**
     * 根据主键更新资质（全字段）
     * @param record 资质实体
     * @return 影响行数
     */
    int updateByPrimaryKey(SupplierQualification record);

    /**
     * 根据供应商ID和资质类型查询资质列表
     * @param supplierId 供应商ID
     * @param type 资质类型
     * @return 资质列表
     */
    List<SupplierQualification> selectBySupplierAndType(@Param("supplierId") Integer supplierId, @Param("type") String type);
}
