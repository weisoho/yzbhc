package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ManufacturerQualificationWarningView;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.SupplierQualificationView;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

/**
 * 供应商维护服务。
 */
public interface SupplierManagementService {

    /**
     * 获取预警统计数据。
     *
     * @return 统计结果
     */
    Map<String, Integer> getWarningStatistics();

    /**
     * 分页查询供应商。
     *
     * @param query 查询条件
     * @return 供应商分页结果
     */
    PageResult<SupplierEntity> querySuppliers(ScmRequest.SupplierQuery query);

    /**
     * 分页查询供应商资质。
     *
     * @param query 查询条件
     * @return 资质分页结果
     */
    PageResult<SupplierQualificationView> queryQualifications(ScmRequest.QualificationQuery query);

    /**
     * 分页查询供应商资质预警。
     *
     * @param query 查询条件
     * @return 资质预警分页结果
     */
    PageResult<SupplierQualificationView> queryQualificationWarnings(ScmRequest.QualificationQuery query);

    /**
     * 分页查询厂商资质预警。
     *
     * @param query 查询条件
     * @return 厂商资质预警分页结果
     */
    PageResult<ManufacturerQualificationWarningView> queryManufacturerWarnings(ScmRequest.ManufacturerWarningQuery query);

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
     * @param certificateName 资质名称
     * @param licenseNumber 证件编号
     * @return 资质列表
     */
    List<SupplierQualificationEntity> listQualifications(Long supplierId, String type, String certificateName, String licenseNumber);

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

    /**
     * 导出供应商数据到 Excel。
     * 支持百万级数据，采用多线程、分批次处理。
     *
     * @param query 查询条件
     * @param outputStream 输出流
     */
    void exportSuppliers(ScmRequest.SupplierQuery query, OutputStream outputStream);

    /**
     * 按选中供应商主键导出供应商数据。
     *
     * @param supplierIds 供应商主键集合
     * @param outputStream 输出流
     */
    void exportSuppliersByIds(List<Long> supplierIds, OutputStream outputStream);

    /**
     * 导出供应商资质数据到 Excel。
     *
     * @param query 查询条件
     * @param outputStream 输出流
     */
    void exportQualifications(ScmRequest.QualificationQuery query, OutputStream outputStream);

    /**
     * 按选中资质主键导出资质预警数据。
     *
     * @param qualificationIds 资质主键集合
     * @param outputStream 输出流
     */
    void exportQualificationWarningsByIds(List<Long> qualificationIds, OutputStream outputStream);

    /**
     * 导出厂商资质预警数据。
     *
     * @param query 查询条件
     * @param outputStream 输出流
     */
    void exportManufacturerWarnings(ScmRequest.ManufacturerWarningQuery query, OutputStream outputStream);
}