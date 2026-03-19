package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.SupplierQualificationView;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
import com.yunsheng.yzb.service.scm.SupplierManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 供应商维护控制器。
 */
@Validated
@RestController
@RequestMapping("/api/scm/suppliers")
public class SupplierManagementController {

    /**
     * 供应商维护服务。
     */
    @Resource
    private SupplierManagementService supplierManagementService;

    /**
     * 获取预警统计数据。
     *
     * @return 统计结果
     */
    @GetMapping("/warning-statistics")
    public AjaxResult<Map<String, Integer>> warningStatistics() {
        return AjaxResult.success(supplierManagementService.getWarningStatistics());
    }

    /**
     * 分页查询供应商列表。
     *
     * @param query 供应商分页查询条件
     * @return 供应商分页结果
     */
    @GetMapping
    public AjaxResult<PageResult<SupplierEntity>> page(ScmRequest.SupplierQuery query) {
        return AjaxResult.success(supplierManagementService.querySuppliers(query));
    }

    /**
     * 查询当前可用于业务绑定的供应商列表。
     *
     * @return 可用供应商列表
     */
    @GetMapping("/enabled")
    public AjaxResult<List<SupplierEntity>> enabledList() {
        return AjaxResult.success(supplierManagementService.listEnabledSuppliers());
    }

    /**
     * 查询单个供应商详情。
     *
     * @param supplierId 供应商主键
     * @return 供应商详情
     */
    @GetMapping("/{supplierId}")
    public AjaxResult<SupplierEntity> detail(@PathVariable Long supplierId) {
        return AjaxResult.success(supplierManagementService.getSupplier(supplierId));
    }

    /**
     * 新增供应商。
     *
     * @param request 供应商保存请求体，JSON 格式
     * @return 新增后的供应商信息
     */
    @PostMapping
    public AjaxResult<SupplierEntity> create(@Valid @RequestBody ScmRequest.SupplierSave request) {
        return AjaxResult.success(supplierManagementService.createSupplier(request));
    }

    /**
     * 更新供应商基础信息。
     *
     * @param supplierId 供应商主键
     * @param request    供应商保存请求体，JSON 格式
     * @return 更新后的供应商信息
     */
    @PutMapping("/{supplierId}")
    public AjaxResult<SupplierEntity> update(@PathVariable Long supplierId,
            @Valid @RequestBody ScmRequest.SupplierSave request) {
        return AjaxResult.success(supplierManagementService.updateSupplier(supplierId, request));
    }

    /**
     * 删除供应商。
     *
     * @param supplierId 供应商主键
     * @return 删除结果
     */
    @DeleteMapping("/{supplierId}")
    public AjaxResult<Boolean> delete(@PathVariable Long supplierId) {
        supplierManagementService.deleteSupplier(supplierId);
        return AjaxResult.success(Boolean.TRUE);
    }

    /**
     * 分页查询供应商资质列表。
     *
     * @param query 资质分页查询参数
     * @return 资质分页结果
     */
    @GetMapping("/qualifications")
    public AjaxResult<PageResult<SupplierQualificationView>> qualifications(ScmRequest.QualificationQuery query) {
        return AjaxResult.success(supplierManagementService.queryQualifications(query));
    }

    /**
     * 查询指定供应商资质列表（不分页）。
     *
     * @param supplierId 供应商主键
     * @param type       资质类型，可为空
     * @return 供应商资质列表
     */
    @GetMapping("/{supplierId}/qualifications")
    public AjaxResult<List<SupplierQualificationEntity>> qualifications(@PathVariable Long supplierId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String certificateName,
            @RequestParam(required = false) String licenseNumber) {
        return AjaxResult.success(supplierManagementService.listQualifications(supplierId, type, certificateName, licenseNumber));
    }

    /**
     * 为供应商新增资质记录。
     *
     * @param supplierId 供应商主键
     * @param request    资质保存请求体，JSON 格式
     * @return 新增后的资质信息
     */
    @PostMapping("/{supplierId}/qualifications")
    public AjaxResult<SupplierQualificationEntity> createQualification(@PathVariable Long supplierId,
            @Valid @RequestBody ScmRequest.QualificationSave request) {
        return AjaxResult.success(supplierManagementService.createQualification(supplierId, request));
    }

    /**
     * 更新供应商资质。
     *
     * @param qualificationId 资质主键
     * @param request         资质保存请求体，JSON 格式
     * @return 更新后的资质信息
     */
    @PutMapping("/qualifications/{qualificationId}")
    public AjaxResult<SupplierQualificationEntity> updateQualification(@PathVariable Long qualificationId,
            @Valid @RequestBody ScmRequest.QualificationSave request) {
        return AjaxResult.success(supplierManagementService.updateQualification(qualificationId, request));
    }

    /**
     * 删除供应商资质。
     *
     * @param qualificationId 资质主键
     * @return 删除结果
     */
    @DeleteMapping("/qualifications/{qualificationId}")
    public AjaxResult<Boolean> deleteQualification(@PathVariable Long qualificationId) {
        supplierManagementService.deleteQualification(qualificationId);
        return AjaxResult.success(Boolean.TRUE);
    }
}