package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;

import java.util.List;

/**
 * 供应商维护服务。
 */
public interface SupplierManagementService {

    /**
     * 分页查询供应商。
     *
     * @param query 查询条件
     * @return 供应商分页结果
     */
    PageResult<SupplierEntity> querySuppliers(ScmRequest.SupplierQuery query);

    /**
     * 查询供应商详情。
     *
     * @param supplierId 供应商主键
     * @return 供应商详情
     */
    SupplierEntity getSupplier(Long supplierId);

    /**
     * 新增供应商。
     *
     * @param request 供应商保存参数
     * @return 新增后的供应商信息
     */
    SupplierEntity createSupplier(ScmRequest.SupplierSave request);

    /**
     * 更新供应商。
     *
     * @param supplierId 供应商主键
     * @param request 供应商保存参数
     * @return 更新后的供应商信息
     */
    SupplierEntity updateSupplier(Long supplierId, ScmRequest.SupplierSave request);

    /**
     * 删除供应商。
     *
     * @param supplierId 供应商主键
     */
    void deleteSupplier(Long supplierId);

    /**
     * 查询供应商资质列表。
     *
     * @param supplierId 供应商主键
     * @param type 资质类型
     * @return 资质列表
     */
    List<SupplierQualificationEntity> listQualifications(Long supplierId, String type);

    /**
     * 新增供应商资质。
     *
     * @param supplierId 供应商主键
     * @param request 资质保存参数
     * @return 新增后的资质信息
     */
    SupplierQualificationEntity createQualification(Long supplierId, ScmRequest.QualificationSave request);

    /**
     * 更新供应商资质。
     *
     * @param qualificationId 资质主键
     * @param request 资质保存参数
     * @return 更新后的资质信息
     */
    SupplierQualificationEntity updateQualification(Long qualificationId, ScmRequest.QualificationSave request);

    /**
     * 删除供应商资质。
     *
     * @param qualificationId 资质主键
     */
    void deleteQualification(Long qualificationId);

    /**
     * 查询可用供应商列表。
     *
     * @return 可用供应商列表
     */
    List<SupplierEntity> listEnabledSuppliers();
}