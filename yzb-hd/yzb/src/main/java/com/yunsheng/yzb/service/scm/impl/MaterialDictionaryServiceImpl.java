package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;
import com.yunsheng.yzb.mapper.scm.MaterialMapper;
import com.yunsheng.yzb.mapper.scm.SupplierMpMapper;
import com.yunsheng.yzb.mapper.scm.SupplierQualificationMpMapper;
import com.yunsheng.yzb.service.scm.MaterialDictionaryService;
import com.yunsheng.yzb.service.scm.OperationLogService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 物资字典服务实现。
 */
@Service
public class MaterialDictionaryServiceImpl implements MaterialDictionaryService {

    @Resource
    private MaterialMapper materialMapper;

    @Resource(name = "supplierMpMapper")
    private SupplierMpMapper supplierMapper;

    @Resource(name = "supplierQualificationMpMapper")
    private SupplierQualificationMpMapper qualificationMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public PageResult<MaterialEntity> queryMaterials(ScmRequest.MaterialQuery query) {
        LambdaQueryWrapper<MaterialEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getMaterialCode()), MaterialEntity::getMaterialCode, query.getMaterialCode())
                .like(StringUtils.hasText(query.getName()), MaterialEntity::getName, query.getName())
                .like(StringUtils.hasText(query.getSupplier()), MaterialEntity::getSupplierName, query.getSupplier())
                .like(StringUtils.hasText(query.getManufacturer()), MaterialEntity::getManufacturer, query.getManufacturer())
                .eq(StringUtils.hasText(query.getStatus()), MaterialEntity::getStatus, query.getStatus())
                .orderByDesc(MaterialEntity::getUpdateTime, MaterialEntity::getCreateTime);
        Page<MaterialEntity> page = materialMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public MaterialEntity getMaterial(Long materialId) {
        MaterialEntity entity = materialMapper.selectById(materialId);
        if (entity == null) {
            throw new ScmBusinessException("物资不存在");
        }
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public MaterialEntity createMaterial(ScmRequest.MaterialSave request) {
        SupplierEntity supplier = validateSupplier(request.getSupplierId());
        SupplierQualificationEntity qualification = validateQualification(request.getQualificationId(), request.getSupplierId());
        checkMaterialUnique(request, null);
        MaterialEntity entity = new MaterialEntity();
        BeanUtils.copyProperties(request, entity);
        entity.setMaterialCode(StringUtils.hasText(request.getMaterialCode())
                ? request.getMaterialCode()
                : ScmCodeGenerator.nextCode(materialMapper, "MAT", "material_code"));
        entity.setSupplierName(supplier.getName());
        entity.setRegistrationNumber(qualification.getLicenseNumber());
        entity.setStatus(StringUtils.hasText(request.getStatus()) ? request.getStatus() : ScmConstants.STATUS_ACTIVE);
        entity.setCreateTime(LocalDateTime.now());
        entity.setUpdateTime(LocalDateTime.now());
        materialMapper.insert(entity);
        operationLogService.save("system", "新增", "新增物资字典: " + entity.getName(), ScmConstants.LOG_SUCCESS,
                "物资字典", entity.getMaterialCode());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public MaterialEntity updateMaterial(Long materialId, ScmRequest.MaterialSave request) {
        MaterialEntity entity = getMaterial(materialId);
        SupplierEntity supplier = validateSupplier(request.getSupplierId());
        SupplierQualificationEntity qualification = validateQualification(request.getQualificationId(), request.getSupplierId());
        checkMaterialUnique(request, materialId);
        BeanUtils.copyProperties(request, entity);
        entity.setId(materialId);
        entity.setSupplierName(supplier.getName());
        entity.setRegistrationNumber(qualification.getLicenseNumber());
        if (!StringUtils.hasText(request.getMaterialCode())) {
            entity.setMaterialCode(entity.getMaterialCode());
        }
        entity.setUpdateTime(LocalDateTime.now());
        materialMapper.updateById(entity);
        operationLogService.save("system", "维护", "更新物资字典: " + entity.getName(), ScmConstants.LOG_SUCCESS,
                "物资字典", entity.getMaterialCode());
        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteMaterial(Long materialId) {
        MaterialEntity entity = getMaterial(materialId);
        materialMapper.deleteById(materialId);
        operationLogService.save("system", "删除", "删除物资字典: " + entity.getName(), ScmConstants.LOG_SUCCESS,
                "物资字典", entity.getMaterialCode());
    }

    @Override
    public List<MaterialEntity> listEnabledMaterials() {
        return materialMapper.selectList(new LambdaQueryWrapper<MaterialEntity>()
                .eq(MaterialEntity::getStatus, ScmConstants.STATUS_ACTIVE)
                .orderByAsc(MaterialEntity::getName));
    }

    private SupplierEntity validateSupplier(Long supplierId) {
        SupplierEntity supplier = supplierMapper.selectById(supplierId);
        if (supplier == null) {
            throw new ScmBusinessException("供应商不存在");
        }
        if (!ScmConstants.SUPPLIER_AVAILABLE.equals(supplier.getStatus())) {
            throw new ScmBusinessException("供应商当前不可用，不能绑定物资");
        }
        return supplier;
    }

    private SupplierQualificationEntity validateQualification(Long qualificationId, Long supplierId) {
        SupplierQualificationEntity qualification = qualificationMapper.selectById(qualificationId);
        if (qualification == null || !supplierId.equals(qualification.getSupplierId())) {
            throw new ScmBusinessException("注册证不存在或不属于当前供应商");
        }
        if (ScmConstants.QUALIFICATION_EXPIRED.equals(qualification.getStatus())) {
            throw new ScmBusinessException("注册证已过期，不能绑定物资");
        }
        return qualification;
    }

    private void checkMaterialUnique(ScmRequest.MaterialSave request, Long excludeId) {
        LambdaQueryWrapper<MaterialEntity> wrapper = new LambdaQueryWrapper<MaterialEntity>()
                .eq(MaterialEntity::getSupplierId, request.getSupplierId())
                .eq(MaterialEntity::getQualificationId, request.getQualificationId())
                .eq(MaterialEntity::getName, request.getName())
                .eq(MaterialEntity::getSpecification, request.getSpecification())
                .eq(MaterialEntity::getModel, request.getModel());
        if (excludeId != null) {
            wrapper.ne(MaterialEntity::getId, excludeId);
        }
        Long count = materialMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new ScmBusinessException("同一供应商和注册证下已存在相同的物资定义");
        }
    }
}