package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.SupplierEntity;
import com.yunsheng.yzb.modules.scm.entity.SupplierQualificationEntity;
import com.yunsheng.yzb.modules.scm.service.SupplierManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 供应商维护接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/suppliers")
public class SupplierManagementController {

    @Resource
    private SupplierManagementService supplierManagementService;

    @GetMapping
    public AjaxResult<PageResult<SupplierEntity>> page(ScmRequest.SupplierQuery query) {
        return AjaxResult.success(supplierManagementService.querySuppliers(query));
    }

    @GetMapping("/enabled")
    public AjaxResult<List<SupplierEntity>> enabledList() {
        return AjaxResult.success(supplierManagementService.listEnabledSuppliers());
    }

    @GetMapping("/{supplierId}")
    public AjaxResult<SupplierEntity> detail(@PathVariable Long supplierId) {
        return AjaxResult.success(supplierManagementService.getSupplier(supplierId));
    }

    @PostMapping
    public AjaxResult<SupplierEntity> create(@Valid @RequestBody ScmRequest.SupplierSave request) {
        return AjaxResult.success(supplierManagementService.createSupplier(request));
    }

    @PutMapping("/{supplierId}")
    public AjaxResult<SupplierEntity> update(@PathVariable Long supplierId,
                                             @Valid @RequestBody ScmRequest.SupplierSave request) {
        return AjaxResult.success(supplierManagementService.updateSupplier(supplierId, request));
    }

    @DeleteMapping("/{supplierId}")
    public AjaxResult<Boolean> delete(@PathVariable Long supplierId) {
        supplierManagementService.deleteSupplier(supplierId);
        return AjaxResult.success(Boolean.TRUE);
    }

    @GetMapping("/{supplierId}/qualifications")
    public AjaxResult<List<SupplierQualificationEntity>> qualifications(@PathVariable Long supplierId,
                                                                        @RequestParam(required = false) String type) {
        return AjaxResult.success(supplierManagementService.listQualifications(supplierId, type));
    }

    @PostMapping("/{supplierId}/qualifications")
    public AjaxResult<SupplierQualificationEntity> createQualification(@PathVariable Long supplierId,
                                                                       @Valid @RequestBody ScmRequest.QualificationSave request) {
        return AjaxResult.success(supplierManagementService.createQualification(supplierId, request));
    }

    @PutMapping("/qualifications/{qualificationId}")
    public AjaxResult<SupplierQualificationEntity> updateQualification(@PathVariable Long qualificationId,
                                                                       @Valid @RequestBody ScmRequest.QualificationSave request) {
        return AjaxResult.success(supplierManagementService.updateQualification(qualificationId, request));
    }

    @DeleteMapping("/qualifications/{qualificationId}")
    public AjaxResult<Boolean> deleteQualification(@PathVariable Long qualificationId) {
        supplierManagementService.deleteQualification(qualificationId);
        return AjaxResult.success(Boolean.TRUE);
    }
}