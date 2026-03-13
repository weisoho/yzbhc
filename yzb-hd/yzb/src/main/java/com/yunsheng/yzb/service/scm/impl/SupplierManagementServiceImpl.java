package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
import com.yunsheng.yzb.mapper.scm.SupplierMpMapper;
import com.yunsheng.yzb.mapper.scm.SupplierQualificationMpMapper;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.SupplierManagementService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 供应商维护服务实现。
 */
@Service
public class SupplierManagementServiceImpl implements SupplierManagementService {

    @Resource(name = "supplierMpMapper")
    private SupplierMpMapper supplierMapper;

    @Resource(name = "supplierQualificationMpMapper")
    private SupplierQualificationMpMapper qualificationMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public PageResult<SupplierEntity> querySuppliers(ScmRequest.SupplierQuery query) {
        LambdaQueryWrapper<SupplierEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getName()), SupplierEntity::getName, query.getName())
                .like(StringUtils.hasText(query.getContactPerson()), SupplierEntity::getContactPerson, query.getContactPerson())
                .like(StringUtils.hasText(query.getContactPhone()), SupplierEntity::getContactPhone, query.getContactPhone())
                .eq(StringUtils.hasText(query.getEnterpriseType()), SupplierEntity::getEnterpriseType, query.getEnterpriseType())
                .eq(StringUtils.hasText(query.getStatus()), SupplierEntity::getStatus, query.getStatus())
                .orderByDesc(SupplierEntity::getUpdateTime, SupplierEntity::getCreateTime);
        Page<SupplierEntity> page = supplierMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
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
    public List<SupplierQualificationEntity> listQualifications(Long supplierId, String type) {
        LambdaQueryWrapper<SupplierQualificationEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(supplierId != null, SupplierQualificationEntity::getSupplierId, supplierId)
                .eq(StringUtils.hasText(type), SupplierQualificationEntity::getType, type)
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
}