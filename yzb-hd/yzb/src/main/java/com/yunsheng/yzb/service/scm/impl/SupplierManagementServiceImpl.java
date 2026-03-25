package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.export.ExportConfig;
import com.yunsheng.yzb.export.ExportProcessor;
import com.yunsheng.yzb.export.scm.ManufacturerQualificationWarningConverter;
import com.yunsheng.yzb.export.scm.QualificationConverter;
import com.yunsheng.yzb.export.scm.SupplierConverter;
import com.yunsheng.yzb.vo.scm.ManufacturerQualificationWarningView;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.SupplierQualificationView;
import com.yunsheng.yzb.mapper.scm.SupplierMpMapper;
import com.yunsheng.yzb.mapper.scm.SupplierQualificationMpMapper;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.SupplierManagementService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 供应商维护服务实现。
 */
@Service
public class SupplierManagementServiceImpl implements SupplierManagementService {

    private static final int DEFAULT_WARNING_DAYS = 90;

    @Resource(name = "supplierMpMapper")
    private SupplierMpMapper supplierMapper;

    @Resource(name = "supplierQualificationMpMapper")
    private SupplierQualificationMpMapper qualificationMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public Map<String, Integer> getWarningStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        Integer warningDays = DEFAULT_WARNING_DAYS;
        stats.put("supplierCount", safeCount(qualificationMapper.countSupplierWarnings(warningDays)));
        stats.put("manufacturerCount", safeCount(qualificationMapper.countManufacturerWarnings(warningDays)));
        stats.put("productCount", safeCount(qualificationMapper.countProductWarnings(warningDays)));
        return stats;
    }

    @Override
    public PageResult<SupplierEntity> querySuppliers(ScmRequest.SupplierQuery query) {
        LambdaQueryWrapper<SupplierEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getName()), SupplierEntity::getName, query.getName())
                .like(StringUtils.hasText(query.getContactPerson()), SupplierEntity::getContactPerson, query.getContactPerson())
                .like(StringUtils.hasText(query.getContactPhone()), SupplierEntity::getContactPhone, query.getContactPhone())
                .like(StringUtils.hasText(query.getLegalRepresentative()), SupplierEntity::getLegalRepresentative, query.getLegalRepresentative())
                .eq(StringUtils.hasText(query.getEnterpriseType()), SupplierEntity::getEnterpriseType, query.getEnterpriseType())
                .eq(StringUtils.hasText(query.getStatus()), SupplierEntity::getStatus, query.getStatus())
                .orderByDesc(SupplierEntity::getUpdateTime, SupplierEntity::getCreateTime);
        Page<SupplierEntity> page = supplierMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public PageResult<SupplierQualificationView> queryQualifications(ScmRequest.QualificationQuery query) {
        Page<SupplierQualificationView> page = new Page<>(query.getPageNum(), query.getPageSize());
        return ScmPageHelper.of(qualificationMapper.selectQualificationViewPage(page, query));
    }

    @Override
    public PageResult<SupplierQualificationView> queryQualificationWarnings(ScmRequest.QualificationQuery query) {
        query.setWarningDays(normalizeWarningDays(query.getWarningDays()));
        Page<SupplierQualificationView> page = new Page<>(query.getPageNum(), query.getPageSize());
        return ScmPageHelper.of(qualificationMapper.selectQualificationWarningPage(page, query));
    }

    @Override
    public PageResult<ManufacturerQualificationWarningView> queryManufacturerWarnings(ScmRequest.ManufacturerWarningQuery query) {
        query.setWarningDays(normalizeWarningDays(query.getWarningDays()));
        Page<ManufacturerQualificationWarningView> page = new Page<>(query.getPageNum(), query.getPageSize());
        return ScmPageHelper.of(qualificationMapper.selectManufacturerWarningPage(page, query));
    }

    @Override
    public SupplierEntity getSupplier(Long supplierId) {
        SupplierEntity entity = supplierMapper.selectById(supplierId);
        if (entity == null) {
            throw new ScmBusinessException("供应商不存在");
        }
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SupplierEntity createSupplier(ScmRequest.SupplierSave request) {
        checkSupplierNameUnique(request.getName(), null);
        SupplierEntity entity = new SupplierEntity();
        BeanUtils.copyProperties(request, entity);
        entity.setSupplierCode(ScmCodeGenerator.nextCode(supplierMapper, "SUP", "supplier_code"));
        entity.setStatus(ScmConstants.SUPPLIER_UNAVAILABLE);
        entity.setCertificateCount(0);
        entity.setCreateTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        supplierMapper.insert(entity);
        operationLogService.save("system", "维护", "新增供应商: " + entity.getName(), ScmConstants.LOG_SUCCESS,
                "供应商维护", entity.getSupplierCode());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SupplierEntity updateSupplier(Long supplierId, ScmRequest.SupplierSave request) {
        SupplierEntity entity = getSupplier(supplierId);
        checkSupplierNameUnique(request.getName(), supplierId);
        String originalName = entity.getName();
        BeanUtils.copyProperties(request, entity);
        entity.setId(supplierId);
        entity.setUpdateTime(LocalDateTime.now());
        supplierMapper.updateById(entity);
        operationLogService.save("system", "维护", "更新供应商: " + originalName + " -> " + entity.getName(),
                ScmConstants.LOG_SUCCESS, "供应商维护", entity.getSupplierCode());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSupplier(Long supplierId) {
        SupplierEntity entity = getSupplier(supplierId);
        long materialCount = qualificationMapper.selectCount(new LambdaQueryWrapper<SupplierQualificationEntity>()
                .eq(SupplierQualificationEntity::getSupplierId, supplierId));
        if (materialCount > 0) {
            throw new ScmBusinessException("供应商下仍存在资质记录，不能直接删除");
        }
        supplierMapper.deleteById(supplierId);
        operationLogService.save("system", "删除", "删除供应商: " + entity.getName(), ScmConstants.LOG_SUCCESS,
                "供应商维护", entity.getSupplierCode());
    }

    @Override
    public List<SupplierQualificationEntity> listQualifications(Long supplierId, String type, String certificateName, String licenseNumber) {
        LambdaQueryWrapper<SupplierQualificationEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(supplierId != null, SupplierQualificationEntity::getSupplierId, supplierId)
                .eq(StringUtils.hasText(type), SupplierQualificationEntity::getType, type)
                .like(StringUtils.hasText(certificateName), SupplierQualificationEntity::getCertificateName, certificateName)
                .like(StringUtils.hasText(licenseNumber), SupplierQualificationEntity::getLicenseNumber, licenseNumber)
                .orderByDesc(SupplierQualificationEntity::getExpiryDate, SupplierQualificationEntity::getCreateTime);
        return qualificationMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SupplierQualificationEntity createQualification(Long supplierId, ScmRequest.QualificationSave request) {
        SupplierEntity supplier = getSupplier(supplierId);
        SupplierQualificationEntity entity = new SupplierQualificationEntity();
        BeanUtils.copyProperties(request, entity);
        entity.setSupplierId(supplierId);
        entity.setStatus(resolveQualificationStatus(request.getExpiryDate()));
        entity.setCreateTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        qualificationMapper.insert(entity);
        refreshSupplierAvailability(supplierId);
        operationLogService.save("system", "维护", "新增供应商资质: " + supplier.getName() + " / " + request.getType(),
                ScmConstants.LOG_SUCCESS, "供应商资质", request.getLicenseNumber());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SupplierQualificationEntity updateQualification(Long qualificationId, ScmRequest.QualificationSave request) {
        SupplierQualificationEntity entity = qualificationMapper.selectById(qualificationId);
        if (entity == null) {
            throw new ScmBusinessException("供应商资质不存在");
        }
        BeanUtils.copyProperties(request, entity);
        entity.setId(qualificationId);
        entity.setStatus(resolveQualificationStatus(request.getExpiryDate()));
        entity.setUpdateTime(LocalDateTime.now());
        qualificationMapper.updateById(entity);
        refreshSupplierAvailability(entity.getSupplierId());
        operationLogService.save("system", "维护", "更新供应商资质: " + request.getType(), ScmConstants.LOG_SUCCESS,
                "供应商资质", request.getLicenseNumber());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteQualification(Long qualificationId) {
        SupplierQualificationEntity entity = qualificationMapper.selectById(qualificationId);
        if (entity == null) {
            throw new ScmBusinessException("供应商资质不存在");
        }
        qualificationMapper.deleteById(qualificationId);
        refreshSupplierAvailability(entity.getSupplierId());
        operationLogService.save("system", "删除", "删除供应商资质: " + entity.getLicenseNumber(), ScmConstants.LOG_SUCCESS,
                "供应商资质", entity.getLicenseNumber());
    }

    @Override
    public List<SupplierEntity> listEnabledSuppliers() {
        return supplierMapper.selectList(new LambdaQueryWrapper<SupplierEntity>()
                .eq(SupplierEntity::getStatus, ScmConstants.SUPPLIER_AVAILABLE)
                .orderByAsc(SupplierEntity::getName));
    }

    @Override
    public void exportSuppliers(ScmRequest.SupplierQuery query, OutputStream outputStream) {
        // 构建查询条件，导出时采用分页拉取，避免一次性加载全量数据。
        LambdaQueryWrapper<SupplierEntity> wrapper = buildSupplierQueryWrapper(query);

        // 创建导出处理器和转换器
        ExportProcessor<SupplierEntity> processor = new ExportProcessor<>();
        SupplierConverter converter = new SupplierConverter();

        // 配置导出参数
        ExportConfig config = new ExportConfig();
        config.setBatchSize(2000);
        config.setThreadPoolSize(1);
        config.setEnableProgress(true);
        config.setProgressInterval(1000);
        config.setSheetName("供应商列表");
        config.setFileNamePrefix("supplier_export");
        config.setIncludeHeader(true);

        final int pageSize = config.getBatchSize();
        processor.exportStream(pageIndex -> supplierMapper
                        .selectPage(new Page<>(pageIndex + 1L, pageSize, false), wrapper)
                        .getRecords(),
                converter,
                outputStream,
                config,
                null);
    }

    @Override
    public void exportSuppliersByIds(List<Long> supplierIds, OutputStream outputStream) {
        LambdaQueryWrapper<SupplierEntity> wrapper = new LambdaQueryWrapper<SupplierEntity>()
                .in(SupplierEntity::getId, supplierIds)
                .orderByDesc(SupplierEntity::getUpdateTime, SupplierEntity::getCreateTime);

        List<SupplierEntity> suppliers = supplierMapper.selectList(wrapper);
        ExportProcessor<SupplierEntity> processor = new ExportProcessor<>();
        SupplierConverter converter = new SupplierConverter();
        ExportConfig config = new ExportConfig();
        config.setBatchSize(2000);
        config.setThreadPoolSize(1);
        config.setEnableProgress(true);
        config.setProgressInterval(1000);
        config.setSheetName("供应商列表");
        config.setFileNamePrefix("supplier_export");
        config.setIncludeHeader(true);

        processor.export(suppliers, converter, outputStream, config, null);
    }

    @Override
    public void exportQualifications(ScmRequest.QualificationQuery query, OutputStream outputStream) {
        // 构建查询条件，导出时采用分页拉取，避免一次性加载全量数据。
        LambdaQueryWrapper<SupplierQualificationEntity> wrapper = buildQualificationQueryWrapper(query);

        // 创建导出处理器和转换器
        ExportProcessor<SupplierQualificationEntity> processor = new ExportProcessor<>();
        QualificationConverter converter = new QualificationConverter();

        // 配置导出参数
        ExportConfig config = new ExportConfig();
        config.setBatchSize(2000);
        config.setThreadPoolSize(1);
        config.setEnableProgress(true);
        config.setProgressInterval(1000);
        config.setSheetName("供应商资质");
        config.setFileNamePrefix("qualification_export");
        config.setIncludeHeader(true);

        final int pageSize = config.getBatchSize();
        processor.exportStream(pageIndex -> qualificationMapper
                        .selectPage(new Page<>(pageIndex + 1L, pageSize, false), wrapper)
                        .getRecords(),
                converter,
                outputStream,
                config,
                null);
    }

    @Override
    public void exportQualificationWarningsByIds(List<Long> qualificationIds, OutputStream outputStream) {
        LambdaQueryWrapper<SupplierQualificationEntity> wrapper = new LambdaQueryWrapper<SupplierQualificationEntity>()
                .in(SupplierQualificationEntity::getId, qualificationIds)
                .orderByDesc(SupplierQualificationEntity::getExpiryDate, SupplierQualificationEntity::getCreateTime);

        List<SupplierQualificationEntity> qualifications = qualificationMapper.selectList(wrapper);
        ExportProcessor<SupplierQualificationEntity> processor = new ExportProcessor<>();
        QualificationConverter converter = new QualificationConverter();
        ExportConfig config = new ExportConfig();
        config.setBatchSize(2000);
        config.setThreadPoolSize(1);
        config.setEnableProgress(true);
        config.setProgressInterval(1000);
        config.setSheetName("资质预警");
        config.setFileNamePrefix("qualification_warning_export");
        config.setIncludeHeader(true);

        processor.export(qualifications, converter, outputStream, config, null);
    }

    @Override
    public void exportManufacturerWarnings(ScmRequest.ManufacturerWarningQuery query, OutputStream outputStream) {
        query.setWarningDays(normalizeWarningDays(query.getWarningDays()));

        ExportProcessor<ManufacturerQualificationWarningView> processor = new ExportProcessor<>();
        ManufacturerQualificationWarningConverter converter = new ManufacturerQualificationWarningConverter();
        ExportConfig config = new ExportConfig();
        config.setBatchSize(2000);
        config.setThreadPoolSize(1);
        config.setEnableProgress(true);
        config.setProgressInterval(1000);
        config.setSheetName("厂商资质预警");
        config.setFileNamePrefix("manufacturer_warning_export");
        config.setIncludeHeader(true);

        final int pageSize = config.getBatchSize();
        processor.exportStream(pageIndex -> qualificationMapper
                        .selectManufacturerWarningPage(new Page<>(pageIndex + 1L, pageSize, false), query)
                        .getRecords(),
                converter,
                outputStream,
                config,
                null);
    }

    /**
     * 构建供应商查询条件。
     */
    private LambdaQueryWrapper<SupplierEntity> buildSupplierQueryWrapper(ScmRequest.SupplierQuery query) {
        LambdaQueryWrapper<SupplierEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getName()), SupplierEntity::getName, query.getName())
                .like(StringUtils.hasText(query.getContactPerson()), SupplierEntity::getContactPerson, query.getContactPerson())
                .like(StringUtils.hasText(query.getContactPhone()), SupplierEntity::getContactPhone, query.getContactPhone())
                .like(StringUtils.hasText(query.getLegalRepresentative()), SupplierEntity::getLegalRepresentative, query.getLegalRepresentative())
                .eq(StringUtils.hasText(query.getEnterpriseType()), SupplierEntity::getEnterpriseType, query.getEnterpriseType())
                .eq(StringUtils.hasText(query.getStatus()), SupplierEntity::getStatus, query.getStatus())
                .orderByDesc(SupplierEntity::getUpdateTime, SupplierEntity::getCreateTime);
        return wrapper;
    }

    /**
     * 构建资质查询条件。
     */
    private LambdaQueryWrapper<SupplierQualificationEntity> buildQualificationQueryWrapper(ScmRequest.QualificationQuery query) {
        LambdaQueryWrapper<SupplierQualificationEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(query.getSupplierId() != null, SupplierQualificationEntity::getSupplierId, query.getSupplierId())
                .eq(StringUtils.hasText(query.getType()), SupplierQualificationEntity::getType, query.getType())
                .like(StringUtils.hasText(query.getCertificateName()), SupplierQualificationEntity::getCertificateName, query.getCertificateName())
                .like(StringUtils.hasText(query.getLicenseNumber()), SupplierQualificationEntity::getLicenseNumber, query.getLicenseNumber())
                .orderByDesc(SupplierQualificationEntity::getExpiryDate, SupplierQualificationEntity::getCreateTime);
        return wrapper;
    }

    private void checkSupplierNameUnique(String supplierName, Long excludeId) {
        LambdaQueryWrapper<SupplierEntity> wrapper = new LambdaQueryWrapper<SupplierEntity>()
                .eq(SupplierEntity::getName, supplierName);
        if (excludeId != null) {
            wrapper.ne(SupplierEntity::getId, excludeId);
        }
        Long count = supplierMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new ScmBusinessException("供应商名称已存在");
        }
    }

    private String resolveQualificationStatus(LocalDate expiryDate) {
        if (expiryDate == null) {
            return ScmConstants.QUALIFICATION_VALID;
        }
        if (expiryDate.isBefore(LocalDate.now())) {
            return ScmConstants.QUALIFICATION_EXPIRED;
        }
        if (!expiryDate.isAfter(LocalDate.now().plusDays(90))) {
            return ScmConstants.QUALIFICATION_EXPIRING;
        }
        return ScmConstants.QUALIFICATION_VALID;
    }

    private void refreshSupplierAvailability(Long supplierId) {
        SupplierEntity supplier = getSupplier(supplierId);
        Long validLicenseCount = qualificationMapper.selectCount(new LambdaQueryWrapper<SupplierQualificationEntity>()
                .eq(SupplierQualificationEntity::getSupplierId, supplierId)
                .eq(SupplierQualificationEntity::getType, "BUSINESS_LICENSE")
                .in(SupplierQualificationEntity::getStatus, ScmConstants.QUALIFICATION_VALID, ScmConstants.QUALIFICATION_EXPIRING));
        Long certificateCount = qualificationMapper.selectCount(new LambdaQueryWrapper<SupplierQualificationEntity>()
                .eq(SupplierQualificationEntity::getSupplierId, supplierId));
        supplier.setCertificateCount(certificateCount == null ? 0 : certificateCount.intValue());
        supplier.setStatus(validLicenseCount != null && validLicenseCount > 0
                ? ScmConstants.SUPPLIER_AVAILABLE : ScmConstants.SUPPLIER_UNAVAILABLE);
        supplier.setUpdateTime(LocalDateTime.now());
        supplierMapper.updateById(supplier);
    }

    private int safeCount(Integer value) {
        return value == null ? 0 : value;
    }

    private int normalizeWarningDays(Integer warningDays) {
        return warningDays == null || warningDays < 1 ? DEFAULT_WARNING_DAYS : warningDays;
    }
}