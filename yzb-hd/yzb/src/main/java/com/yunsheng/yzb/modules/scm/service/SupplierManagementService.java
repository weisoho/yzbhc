package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.SupplierEntity;
import com.yunsheng.yzb.modules.scm.entity.SupplierQualificationEntity;

import java.util.List;

/**
 * 供应商维护服务。
 */
public interface SupplierManagementService {

    PageResult<SupplierEntity> querySuppliers(ScmRequest.SupplierQuery query);

    SupplierEntity getSupplier(Long supplierId);

    SupplierEntity createSupplier(ScmRequest.SupplierSave request);

    SupplierEntity updateSupplier(Long supplierId, ScmRequest.SupplierSave request);

    void deleteSupplier(Long supplierId);

    List<SupplierQualificationEntity> listQualifications(Long supplierId, String type);

    SupplierQualificationEntity createQualification(Long supplierId, ScmRequest.QualificationSave request);

    SupplierQualificationEntity updateQualification(Long qualificationId, ScmRequest.QualificationSave request);

    void deleteQualification(Long qualificationId);

    List<SupplierEntity> listEnabledSuppliers();
}