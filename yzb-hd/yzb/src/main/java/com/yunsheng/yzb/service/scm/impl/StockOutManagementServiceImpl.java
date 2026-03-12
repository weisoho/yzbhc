package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmInventorySupport;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.model.scm.StockOutItemEntity;
import com.yunsheng.yzb.model.scm.StockOutOrderEntity;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryTransactionMapper;
import com.yunsheng.yzb.mapper.scm.StockOutItemMapper;
import com.yunsheng.yzb.mapper.scm.StockOutOrderMapper;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.StockOutManagementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
 * 出库管理服务实现。
 */
@Service
public class StockOutManagementServiceImpl implements StockOutManagementService {

    @Resource
    private StockOutOrderMapper stockOutOrderMapper;

    @Resource
    private StockOutItemMapper stockOutItemMapper;

    @Resource
    private InventoryMapper inventoryMapper;

    @Resource
    private InventoryTransactionMapper inventoryTransactionMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StockOutOrderEntity createStockOut(ScmRequest.StockOutSave request) {
        StockOutOrderEntity order = new StockOutOrderEntity();
        order.setStockOutNumber(ScmCodeGenerator.nextCode(stockOutOrderMapper, "SO", "stock_out_number"));
        order.setStockOutType(request.getStockOutType());
        order.setDepartmentName(request.getDepartmentName());
        order.setOperatorName(request.getOperatorName());
        order.setStatus(ScmConstants.STOCK_OUT_COMPLETED);
        order.setReason(request.getReason());
        order.setRemark(request.getRemark());
        order.setOutboundDate(request.getOutboundDate());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        stockOutOrderMapper.insert(order);

        for (ScmRequest.StockOutItemSave item : request.getItems()) {
            InventoryEntity inventory = inventoryMapper.selectById(item.getInventoryId());
            if (inventory == null) {
                throw new ScmBusinessException("库存不存在");
            }
            if (inventory.getCurrentStock() < item.getOutboundQuantity()) {
                throw new ScmBusinessException("库存不足，无法完成出库");
            }
            inventory.setCurrentStock(inventory.getCurrentStock() - item.getOutboundQuantity());
            inventory.setUpdateTime(LocalDateTime.now());
            ScmInventorySupport.refreshStatus(inventory);
            inventoryMapper.updateById(inventory);

            StockOutItemEntity outItem = new StockOutItemEntity();
            outItem.setStockOutOrderId(order.getId());
            outItem.setInventoryId(inventory.getId());
            outItem.setMaterialId(inventory.getMaterialId());
            outItem.setMaterialCode(inventory.getMaterialCode());
            outItem.setMaterialName(inventory.getMaterialName());
            outItem.setMaterialType(inventory.getCategory());
            outItem.setSpecification(inventory.getSpecification());
            outItem.setModel(inventory.getModel());
            outItem.setUnit(inventory.getUnit());
            outItem.setSupplier(inventory.getSupplier());
            outItem.setManufacturer(inventory.getManufacturer());
            outItem.setRegistrationNumber(inventory.getRegistrationNumber());
            outItem.setBatchNumber(inventory.getBatchNumber());
            outItem.setProductionDate(inventory.getProductionDate());
            outItem.setExpiryDate(inventory.getExpiryDate());
            outItem.setUnitPrice(inventory.getPurchasePrice());
            outItem.setOutboundQuantity(item.getOutboundQuantity());
            outItem.setOutboundDate(request.getOutboundDate());
            outItem.setStatus(ScmConstants.STOCK_OUT_COMPLETED);
            outItem.setUndoStatus(ScmConstants.STOCK_OUT_UNDOABLE);
            outItem.setReason(request.getReason());
            outItem.setCreateTime(LocalDateTime.now());
            outItem.setUpdateTime(LocalDateTime.now());
            stockOutItemMapper.insert(outItem);

            InventoryTransactionEntity transaction = new InventoryTransactionEntity();
            transaction.setInventoryId(inventory.getId());
            transaction.setMaterialId(inventory.getMaterialId());
            transaction.setMaterialCode(inventory.getMaterialCode());
            transaction.setMaterialName(inventory.getMaterialName());
            transaction.setBatchNumber(inventory.getBatchNumber());
            transaction.setOperationType("出库");
            transaction.setQuantity(-item.getOutboundQuantity());
            transaction.setBalanceQuantity(inventory.getCurrentStock());
            transaction.setReferenceNo(order.getStockOutNumber());
            transaction.setOperatorName(request.getOperatorName());
            transaction.setRemark(request.getReason());
            transaction.setOperationTime(LocalDateTime.now());
            inventoryTransactionMapper.insert(transaction);
        }

        operationLogService.save(request.getOperatorName(), "出库", "完成出库: " + order.getStockOutNumber(),
                ScmConstants.LOG_SUCCESS, "出库管理", order.getStockOutNumber());
        return order;
    }

    @Override
    public PageResult<StockOutItemEntity> queryUndoList(ScmRequest.StockOutQuery query) {
        LambdaQueryWrapper<StockOutItemEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getMaterialCode()), StockOutItemEntity::getMaterialCode, query.getMaterialCode())
                .like(StringUtils.hasText(query.getMaterialName()), StockOutItemEntity::getMaterialName, query.getMaterialName())
                .like(StringUtils.hasText(query.getSupplier()), StockOutItemEntity::getSupplier, query.getSupplier())
                .like(StringUtils.hasText(query.getManufacturer()), StockOutItemEntity::getManufacturer, query.getManufacturer())
                .eq(StringUtils.hasText(query.getUndoStatus()), StockOutItemEntity::getUndoStatus, query.getUndoStatus())
                .orderByDesc(StockOutItemEntity::getCreateTime);
        Page<StockOutItemEntity> page = stockOutItemMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StockOutOrderEntity undoStockOut(String materialCode, String outboundDate, ScmRequest.UndoSave request) {
        LocalDate date = LocalDate.parse(outboundDate);
        List<StockOutItemEntity> items = stockOutItemMapper.selectList(new LambdaQueryWrapper<StockOutItemEntity>()
                .eq(StockOutItemEntity::getMaterialCode, materialCode)
                .eq(StockOutItemEntity::getOutboundDate, date)
                .eq(StockOutItemEntity::getUndoStatus, ScmConstants.STOCK_OUT_UNDOABLE));
        if (items.isEmpty()) {
            throw new ScmBusinessException("未找到可撤销的出库记录");
        }
        Long orderId = items.get(0).getStockOutOrderId();
        StockOutOrderEntity order = stockOutOrderMapper.selectById(orderId);
        for (StockOutItemEntity item : items) {
            InventoryEntity inventory = inventoryMapper.selectById(item.getInventoryId());
            if (inventory == null) {
                throw new ScmBusinessException("关联库存不存在，无法撤销");
            }
            inventory.setCurrentStock((inventory.getCurrentStock() == null ? 0 : inventory.getCurrentStock()) + item.getOutboundQuantity());
            inventory.setUpdateTime(LocalDateTime.now());
            ScmInventorySupport.refreshStatus(inventory);
            inventoryMapper.updateById(inventory);

            item.setUndoStatus(ScmConstants.STOCK_OUT_UNDONE);
            item.setUpdateTime(LocalDateTime.now());
            stockOutItemMapper.updateById(item);

            InventoryTransactionEntity transaction = new InventoryTransactionEntity();
            transaction.setInventoryId(inventory.getId());
            transaction.setMaterialId(inventory.getMaterialId());
            transaction.setMaterialCode(inventory.getMaterialCode());
            transaction.setMaterialName(inventory.getMaterialName());
            transaction.setBatchNumber(inventory.getBatchNumber());
            transaction.setOperationType("撤销出库");
            transaction.setQuantity(item.getOutboundQuantity());
            transaction.setBalanceQuantity(inventory.getCurrentStock());
            transaction.setReferenceNo(order.getStockOutNumber());
            transaction.setOperatorName(request.getOperatorName());
            transaction.setRemark(request.getReason());
            transaction.setOperationTime(LocalDateTime.now());
            inventoryTransactionMapper.insert(transaction);
        }
        operationLogService.save(request.getOperatorName(), "出库", "撤销出库: " + order.getStockOutNumber(),
                ScmConstants.LOG_WARNING, "出库管理", order.getStockOutNumber());
        return order;
    }
}