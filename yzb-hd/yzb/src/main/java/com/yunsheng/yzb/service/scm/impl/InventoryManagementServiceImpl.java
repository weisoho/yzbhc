package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmInventorySupport;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryTransactionMapper;
import com.yunsheng.yzb.service.scm.InventoryManagementService;
import com.yunsheng.yzb.service.scm.OperationLogService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 库存管理服务实现。
 */
@Service
public class InventoryManagementServiceImpl implements InventoryManagementService {

    @Resource
    private InventoryMapper inventoryMapper;

    @Resource
    private InventoryTransactionMapper inventoryTransactionMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public PageResult<ScmView.InventoryDetail> queryInventory(ScmRequest.InventoryQuery query) {
        LambdaQueryWrapper<InventoryEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getMaterialCode()), InventoryEntity::getMaterialCode, query.getMaterialCode())
                .like(StringUtils.hasText(query.getMaterialName()), InventoryEntity::getMaterialName, query.getMaterialName())
                .like(StringUtils.hasText(query.getSupplier()), InventoryEntity::getSupplier, query.getSupplier())
                .like(StringUtils.hasText(query.getManufacturer()), InventoryEntity::getManufacturer, query.getManufacturer())
                .like(StringUtils.hasText(query.getWarehouse()), InventoryEntity::getWarehouse, query.getWarehouse())
                .like(StringUtils.hasText(query.getBatchNumber()), InventoryEntity::getBatchNumber, query.getBatchNumber())
                .eq(StringUtils.hasText(query.getStockStatus()), InventoryEntity::getStockStatus, query.getStockStatus())
                .orderByDesc(InventoryEntity::getUpdateTime);
        Page<InventoryEntity> page = inventoryMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        PageResult<InventoryEntity> rawResult = ScmPageHelper.of(page);
        List<ScmView.InventoryDetail> records = rawResult.getRecords().stream().map(this::toInventoryDetail).collect(Collectors.toList());
        return new PageResult<>(rawResult.getCurrent(), rawResult.getSize(), rawResult.getTotal(), records);
    }

    @Override
    public ScmView.InventoryDetail getInventoryDetail(Long inventoryId) {
        InventoryEntity entity = inventoryMapper.selectById(inventoryId);
        if (entity == null) {
            throw new ScmBusinessException("库存记录不存在");
        }
        return toInventoryDetail(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ScmView.InventoryDetail adjustInventory(Long inventoryId, ScmRequest.InventoryAdjustSave request) {
        InventoryEntity entity = inventoryMapper.selectById(inventoryId);
        if (entity == null) {
            throw new ScmBusinessException("库存记录不存在");
        }
        entity.setMinStock(request.getMinStock());
        entity.setMaxStock(request.getMaxStock());
        entity.setExpiryWarningDays(request.getExpiryWarningDays());
        entity.setUpdateTime(LocalDateTime.now());
        ScmInventorySupport.refreshStatus(entity);
        inventoryMapper.updateById(entity);

        InventoryTransactionEntity transaction = new InventoryTransactionEntity();
        transaction.setInventoryId(entity.getId());
        transaction.setMaterialId(entity.getMaterialId());
        transaction.setMaterialCode(entity.getMaterialCode());
        transaction.setMaterialName(entity.getMaterialName());
        transaction.setBatchNumber(entity.getBatchNumber());
        transaction.setOperationType("调整");
        transaction.setQuantity(0);
        transaction.setBalanceQuantity(entity.getCurrentStock());
        transaction.setReferenceNo(entity.getMaterialCode());
        transaction.setOperatorName("system");
        transaction.setRemark(request.getReason());
        transaction.setOperationTime(LocalDateTime.now());
        inventoryTransactionMapper.insert(transaction);

        operationLogService.save("system", "调整", "调整库存阈值: " + entity.getMaterialCode(), ScmConstants.LOG_SUCCESS,
                "库存管理", entity.getMaterialCode());
        return toInventoryDetail(entity);
    }

    @Override
    public PageResult<InventoryTransactionEntity> queryTransactions(ScmRequest.InventoryQuery query) {
        LambdaQueryWrapper<InventoryTransactionEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getMaterialCode()), InventoryTransactionEntity::getMaterialCode, query.getMaterialCode())
                .like(StringUtils.hasText(query.getMaterialName()), InventoryTransactionEntity::getMaterialName, query.getMaterialName())
                .orderByDesc(InventoryTransactionEntity::getOperationTime);
        Page<InventoryTransactionEntity> page = inventoryTransactionMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    private ScmView.InventoryDetail toInventoryDetail(InventoryEntity entity) {
        ScmView.InventoryDetail detail = new ScmView.InventoryDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }
}