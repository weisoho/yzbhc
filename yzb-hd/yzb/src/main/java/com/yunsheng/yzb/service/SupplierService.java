package com.yunsheng.yzb.service;

import com.yunsheng.yzb.model.Supplier;
import com.yunsheng.yzb.model.SupplierQualification;
import java.util.List;

/**
 * 供应商管理服务接口
 * 包含供应商基础信息和资质信息的管理
 */
public interface SupplierService {
    
    // ================== 供应商管理 ==================

    /**
     * 获取所有供应商列表
     * @param name 供应商名称（可选，模糊查询）
     * @return 供应商列表
     */
    List<Supplier> getAllSuppliers(String name);

    /**
     * 根据条件查询供应商列表
     * @param name 供应商名称（可选，模糊查询）
     * @param contactPerson 联系人（可选，模糊查询）
     * @param contactPhone 联系电话（可选，模糊查询）
     * @return 供应商列表
     */
    List<Supplier> getSuppliersByCondition(String name, String contactPerson, String contactPhone);

    /**
     * 根据ID获取供应商详情
     * @param id 供应商ID
     * @return 供应商详情
     */
    Supplier getSupplierById(Integer id);

    /**
     * 新增供应商
     * @param supplier 供应商实体
     * @return 影响行数
     */
    int addSupplier(Supplier supplier);

    /**
     * 更新供应商信息
     * @param supplier 供应商实体
     * @return 影响行数
     */
    int updateSupplier(Supplier supplier);

    /**
     * 删除供应商
     * @param id 供应商ID
     * @return 影响行数
     */
    int deleteSupplier(Integer id);

    // ================== 供应商资质管理 ==================

    /**
     * 获取供应商资质列表
     * @param supplierId 供应商ID
     * @param type 资质类型
     * @return 资质列表
     */
    List<SupplierQualification> getQualifications(Integer supplierId, String type);

    /**
     * 根据ID获取资质详情
     * @param id 资质ID
     * @return 资质详情
     */
    SupplierQualification getQualificationById(Integer id);

    /**
     * 新增资质
     * @param qualification 资质实体
     * @return 影响行数
     */
    int addQualification(SupplierQualification qualification);

    /**
     * 更新资质信息
     * @param qualification 资质实体
     * @return 影响行数
     */
    int updateQualification(SupplierQualification qualification);

    /**
     * 删除资质
     * @param id 资质ID
     * @return 影响行数
     */
    int deleteQualification(Integer id);
}
