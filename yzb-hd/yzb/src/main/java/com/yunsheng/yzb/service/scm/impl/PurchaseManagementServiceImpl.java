package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.common.ScmConstants;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.ExceptionOrderEntity;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderItemEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveItemEntity;
import com.yunsheng.yzb.model.scm.SupplierEntity;
import com.yunsheng.yzb.mapper.scm.ExceptionOrderMapper;
import com.yunsheng.yzb.mapper.scm.MaterialMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseOrderItemMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseOrderMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseReceiveItemMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseReceiveMapper;
import com.yunsheng.yzb.mapper.scm.SupplierMpMapper;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.PurchaseManagementService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 采购管理服务实现。
 */
@Service
public class PurchaseManagementServiceImpl implements PurchaseManagementService {

    @Resource
    private PurchaseOrderMapper purchaseOrderMapper;

    @Resource
    private PurchaseOrderItemMapper purchaseOrderItemMapper;

    @Resource
    private PurchaseReceiveMapper purchaseReceiveMapper;

    @Resource
    private PurchaseReceiveItemMapper purchaseReceiveItemMapper;

    @Resource
    private ExceptionOrderMapper exceptionOrderMapper;

    @Resource
    private MaterialMapper materialMapper;

    @Resource(name = "supplierMpMapper")
    private SupplierMpMapper supplierMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public PageResult<PurchaseOrderEntity> queryOrders(ScmRequest.PurchaseQuery query) {
        LambdaQueryWrapper<PurchaseOrderEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getOrderNumber()), PurchaseOrderEntity::getOrderNumber, query.getOrderNumber())
                .like(StringUtils.hasText(query.getSupplierName()), PurchaseOrderEntity::getSupplierName, query.getSupplierName())
                .eq(StringUtils.hasText(query.getStatus()), PurchaseOrderEntity::getStatus, query.getStatus())
                .orderByDesc(PurchaseOrderEntity::getCreateTime);
        Page<PurchaseOrderEntity> page = purchaseOrderMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public ScmView.PurchaseOrderDetail getOrderDetail(Long orderId) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        List<PurchaseOrderItemEntity> items = purchaseOrderItemMapper.selectList(new LambdaQueryWrapper<PurchaseOrderItemEntity>()
                .eq(PurchaseOrderItemEntity::getPurchaseOrderId, orderId)
                .orderByAsc(PurchaseOrderItemEntity::getId));
        ScmView.PurchaseOrderDetail detail = new ScmView.PurchaseOrderDetail();
        BeanUtils.copyProperties(order, detail);
        detail.setItems(items.stream().map(this::toOrderItemDetail).collect(Collectors.toList()));
        return detail;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrderEntity createOrder(ScmRequest.PurchaseSave request) {
        SupplierEntity supplier = validateSupplier(request.getSupplierId());
        PurchaseOrderEntity order = new PurchaseOrderEntity();
        order.setOrderNumber(ScmCodeGenerator.nextCode(purchaseOrderMapper, "PO", "order_number"));
        order.setDepartmentId(request.getDepartmentId());
        order.setDepartmentName(request.getDepartmentName());
        order.setSupplierId(request.getSupplierId());
        order.setSupplierName(supplier.getName());
        order.setOperatorName(request.getOperatorName());
        order.setPlanType(request.getPlanType());
        order.setStatus(ScmConstants.PURCHASE_DRAFT);
        order.setRemark(request.getRemark());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());

        BigDecimal totalAmount = persistOrderItems(order, request.getItems(), false);
        order.setTotalAmount(totalAmount);
        order.setItemCount(request.getItems().size());
        purchaseOrderMapper.insert(order);
        persistOrderItems(order, request.getItems(), true);
        operationLogService.save(request.getOperatorName(), "新增", "创建采购单: " + order.getOrderNumber(),
                ScmConstants.LOG_SUCCESS, "采购管理", order.getOrderNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrderEntity updateOrder(Long orderId, ScmRequest.PurchaseSave request) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        if (!Objects.equals(order.getStatus(), ScmConstants.PURCHASE_DRAFT)
                && !Objects.equals(order.getStatus(), ScmConstants.PURCHASE_REJECTED)) {
            throw new ScmBusinessException("当前状态不允许修改采购单");
        }
        SupplierEntity supplier = validateSupplier(request.getSupplierId());
        order.setDepartmentId(request.getDepartmentId());
        order.setDepartmentName(request.getDepartmentName());
        order.setSupplierId(request.getSupplierId());
        order.setSupplierName(supplier.getName());
        order.setOperatorName(request.getOperatorName());
        order.setPlanType(request.getPlanType());
        order.setRemark(request.getRemark());
        order.setRejectReason(null);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderItemMapper.delete(new LambdaQueryWrapper<PurchaseOrderItemEntity>()
                .eq(PurchaseOrderItemEntity::getPurchaseOrderId, orderId));
        BigDecimal totalAmount = persistOrderItems(order, request.getItems(), true);
        order.setTotalAmount(totalAmount);
        order.setItemCount(request.getItems().size());
        purchaseOrderMapper.updateById(order);
        operationLogService.save(request.getOperatorName(), "维护", "更新采购单: " + order.getOrderNumber(),
                ScmConstants.LOG_SUCCESS, "采购管理", order.getOrderNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrderEntity submitOrder(Long orderId, String operatorName) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        if (!Objects.equals(order.getStatus(), ScmConstants.PURCHASE_DRAFT)
                && !Objects.equals(order.getStatus(), ScmConstants.PURCHASE_REJECTED)) {
            throw new ScmBusinessException("当前状态不能提交采购单");
        }
        order.setStatus(ScmConstants.PURCHASE_WAIT_AUDIT);
        order.setSubmitTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        purchaseOrderMapper.updateById(order);
        operationLogService.save(operatorName, "提交", "提交采购单: " + order.getOrderNumber(),
                ScmConstants.LOG_SUCCESS, "采购管理", order.getOrderNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrderEntity approveOrder(Long orderId, ScmRequest.PurchaseAudit request) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        ensureWaitAudit(order);
        order.setStatus(ScmConstants.PURCHASE_WAIT_RECEIVE);
        order.setAuditTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        purchaseOrderMapper.updateById(order);
        operationLogService.save(request.getOperatorName(), "审核", "通过采购单: " + order.getOrderNumber(),
                ScmConstants.LOG_SUCCESS, "采购审核", order.getOrderNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrderEntity rejectOrder(Long orderId, ScmRequest.PurchaseAudit request) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        ensureWaitAudit(order);
        order.setStatus(ScmConstants.PURCHASE_REJECTED);
        order.setRejectReason(request.getReason());
        order.setAuditTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        purchaseOrderMapper.updateById(order);
        operationLogService.save(request.getOperatorName(), "审核", "驳回采购单: " + order.getOrderNumber(),
                ScmConstants.LOG_WARNING, "采购审核", order.getOrderNumber());
        return order;
    }

    @Override
    public PageResult<PurchaseOrderEntity> queryPendingReceiveOrders(ScmRequest.PurchaseQuery query) {
        query.setStatus(ScmConstants.PURCHASE_WAIT_RECEIVE);
        return queryOrders(query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseReceiveEntity receiveOrder(Long orderId, ScmRequest.PurchaseReceiveSave request) {
        PurchaseOrderEntity order = mustGetOrder(orderId);
        if (!Objects.equals(order.getStatus(), ScmConstants.PURCHASE_WAIT_RECEIVE)) {
            throw new ScmBusinessException("采购单当前不处于待收货状态");
        }
        List<PurchaseOrderItemEntity> orderItems = purchaseOrderItemMapper.selectList(new LambdaQueryWrapper<PurchaseOrderItemEntity>()
                .eq(PurchaseOrderItemEntity::getPurchaseOrderId, orderId));
        Map<Long, PurchaseOrderItemEntity> itemMap = orderItems.stream()
                .collect(Collectors.toMap(PurchaseOrderItemEntity::getId, item -> item));

        PurchaseReceiveEntity receipt = new PurchaseReceiveEntity();
        receipt.setReceiveNumber(ScmCodeGenerator.nextCode(purchaseReceiveMapper, "RC", "receive_number"));
        receipt.setPurchaseOrderId(order.getId());
        receipt.setOrderNumber(order.getOrderNumber());
        receipt.setSupplierId(order.getSupplierId());
        receipt.setSupplierName(order.getSupplierName());
        receipt.setSupplierCode(resolveSupplierCode(order.getSupplierId()));
        receipt.setDepartmentName(order.getDepartmentName());
        receipt.setBuyer(order.getOperatorName());
        receipt.setContactPerson(request.getContactPerson());
        receipt.setContactPhone(request.getContactPhone());
        receipt.setOrderDate(order.getCreateTime() == null ? LocalDate.now() : order.getCreateTime().toLocalDate());
        receipt.setExpectedDeliveryDate(order.getCreateTime() == null ? LocalDate.now() : order.getCreateTime().toLocalDate().plusDays(3));
        receipt.setActualDeliveryDate(request.getActualDeliveryDate());
        receipt.setReceiver(request.getReceiver());
        receipt.setStatus(ScmConstants.RECEIPT_WAIT_STOCK_IN);
        receipt.setRemark(request.getRemark());
        receipt.setCreateTime(LocalDateTime.now());
        receipt.setUpdateTime(LocalDateTime.now());
        purchaseReceiveMapper.insert(receipt);

        BigDecimal totalAmount = BigDecimal.ZERO;
        int itemCount = 0;
        boolean hasShortage = false;
        for (ScmRequest.PurchaseReceiveItemSave itemRequest : request.getItems()) {
            PurchaseOrderItemEntity orderItem = itemMap.get(itemRequest.getPurchaseOrderItemId());
            if (orderItem == null) {
                throw new ScmBusinessException("存在无效的采购明细");
            }
            int actualReceived = itemRequest.getActualReceivedQuantity() == null ? 0 : itemRequest.getActualReceivedQuantity();
            if (actualReceived > orderItem.getQuantity()) {
                throw new ScmBusinessException("实际到货数量不能超过采购数量");
            }
            PurchaseReceiveItemEntity receiptItem = new PurchaseReceiveItemEntity();
            receiptItem.setReceiveId(receipt.getId());
            receiptItem.setPurchaseOrderItemId(orderItem.getId());
            receiptItem.setProductCode(orderItem.getMaterialCode());
            receiptItem.setProductName(orderItem.getMaterialName());
            receiptItem.setSpecification(orderItem.getSpecification());
            receiptItem.setModel(orderItem.getModel());
            receiptItem.setManufacturer(orderItem.getManufacturer());
            receiptItem.setRegistrationNumber(orderItem.getRegistrationNumber());
            receiptItem.setUnit(orderItem.getUnit());
            receiptItem.setPrice(orderItem.getUnitPrice());
            receiptItem.setQuantity(orderItem.getQuantity());
            receiptItem.setActualReceivedQuantity(actualReceived);
            receiptItem.setAmount(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(actualReceived)));
            receiptItem.setStatus(actualReceived < orderItem.getQuantity() ? "部分到货" : "已到货");
            receiptItem.setShortageReason(itemRequest.getShortageReason());
            receiptItem.setCreateTime(LocalDateTime.now());
            receiptItem.setUpdateTime(LocalDateTime.now());
            purchaseReceiveItemMapper.insert(receiptItem);

            orderItem.setReceivedQuantity(actualReceived);
            orderItem.setStatus(receiptItem.getStatus());
            orderItem.setUpdateTime(LocalDateTime.now());
            purchaseOrderItemMapper.updateById(orderItem);
            totalAmount = totalAmount.add(receiptItem.getAmount());
            itemCount++;

            if (actualReceived < orderItem.getQuantity()) {
                hasShortage = true;
                createExceptionOrder(order, orderItem, itemRequest.getShortageReason(), request.getActualDeliveryDate());
            }
        }
        receipt.setTotalAmount(totalAmount);
        receipt.setItemCount(itemCount);
        purchaseReceiveMapper.updateById(receipt);

        order.setStatus(ScmConstants.PURCHASE_WAIT_STOCK_IN);
        order.setUpdateTime(LocalDateTime.now());
        purchaseOrderMapper.updateById(order);
        operationLogService.save(request.getReceiver(), "收货", "采购收货: " + order.getOrderNumber(),
                hasShortage ? ScmConstants.LOG_WARNING : ScmConstants.LOG_SUCCESS, "采购收货", receipt.getReceiveNumber());
        return receipt;
    }

    @Override
    public PageResult<PurchaseReceiveEntity> queryReceipts(ScmRequest.PurchaseQuery query) {
        LambdaQueryWrapper<PurchaseReceiveEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getOrderNumber()), PurchaseReceiveEntity::getOrderNumber, query.getOrderNumber())
                .like(StringUtils.hasText(query.getSupplierName()), PurchaseReceiveEntity::getSupplierName, query.getSupplierName())
                .eq(StringUtils.hasText(query.getStatus()), PurchaseReceiveEntity::getStatus, query.getStatus())
                .orderByDesc(PurchaseReceiveEntity::getCreateTime);
        Page<PurchaseReceiveEntity> page = purchaseReceiveMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public ScmView.PurchaseReceiveDetail getReceiptDetail(Long receiptId) {
        PurchaseReceiveEntity receipt = purchaseReceiveMapper.selectById(receiptId);
        if (receipt == null) {
            throw new ScmBusinessException("收货单不存在");
        }
        List<PurchaseReceiveItemEntity> items = purchaseReceiveItemMapper.selectList(new LambdaQueryWrapper<PurchaseReceiveItemEntity>()
                .eq(PurchaseReceiveItemEntity::getReceiveId, receiptId)
                .orderByAsc(PurchaseReceiveItemEntity::getId));
        ScmView.PurchaseReceiveDetail detail = new ScmView.PurchaseReceiveDetail();
        BeanUtils.copyProperties(receipt, detail);
        detail.setItems(items.stream().map(this::toReceiptItemDetail).collect(Collectors.toList()));
        return detail;
    }

    @Override
    public PageResult<ExceptionOrderEntity> queryExceptionOrders(ScmRequest.PurchaseQuery query) {
        LambdaQueryWrapper<ExceptionOrderEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getOrderNumber()), ExceptionOrderEntity::getOrderNo, query.getOrderNumber())
                .like(StringUtils.hasText(query.getSupplierName()), ExceptionOrderEntity::getSupplierName, query.getSupplierName())
                .eq(StringUtils.hasText(query.getStatus()), ExceptionOrderEntity::getStatus, query.getStatus())
                .orderByDesc(ExceptionOrderEntity::getCreatedAt);
        Page<ExceptionOrderEntity> page = exceptionOrderMapper.selectPage(new Page<>(query.getCurrent(), query.getSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ExceptionOrderEntity resubmitExceptionOrder(Long exceptionOrderId, String operatorName) {
        ExceptionOrderEntity entity = exceptionOrderMapper.selectById(exceptionOrderId);
        if (entity == null) {
            throw new ScmBusinessException("异常订单不存在");
        }
        entity.setStatus("待验收");
        entity.setResubmittedAt(LocalDateTime.now());
        exceptionOrderMapper.updateById(entity);
        operationLogService.save(operatorName, "提交", "重新提交异常订单: " + entity.getOrderNo(),
                ScmConstants.LOG_SUCCESS, "异常订单", entity.getOrderNo());
        return entity;
    }

    @Override
    public List<PurchaseReceiveEntity> listPendingStockInReceipts() {
        return purchaseReceiveMapper.selectList(new LambdaQueryWrapper<PurchaseReceiveEntity>()
                .eq(PurchaseReceiveEntity::getStatus, ScmConstants.RECEIPT_WAIT_STOCK_IN)
                .orderByDesc(PurchaseReceiveEntity::getCreateTime));
    }

    private PurchaseOrderEntity mustGetOrder(Long orderId) {
        PurchaseOrderEntity order = purchaseOrderMapper.selectById(orderId);
        if (order == null) {
            throw new ScmBusinessException("采购单不存在");
        }
        return order;
    }

    private void ensureWaitAudit(PurchaseOrderEntity order) {
        if (!Objects.equals(order.getStatus(), ScmConstants.PURCHASE_WAIT_AUDIT)) {
            throw new ScmBusinessException("采购单当前不处于待审核状态");
        }
    }

    private SupplierEntity validateSupplier(Long supplierId) {
        SupplierEntity supplier = supplierMapper.selectById(supplierId);
        if (supplier == null) {
            throw new ScmBusinessException("供应商不存在");
        }
        return supplier;
    }

    private BigDecimal persistOrderItems(PurchaseOrderEntity order, List<ScmRequest.PurchaseItemSave> items, boolean persist) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PurchaseOrderItemEntity> entities = new ArrayList<>();
        for (ScmRequest.PurchaseItemSave item : items) {
            MaterialEntity material = materialMapper.selectById(item.getMaterialId());
            if (material == null) {
                throw new ScmBusinessException("存在无效的物资条目");
            }
            PurchaseOrderItemEntity entity = new PurchaseOrderItemEntity();
            entity.setPurchaseOrderId(order.getId());
            entity.setMaterialId(material.getId());
            entity.setMaterialCode(material.getMaterialCode());
            entity.setMaterialName(material.getName());
            entity.setSpecification(material.getSpecification());
            entity.setModel(material.getModel());
            entity.setUnit(material.getUnit());
            entity.setManufacturer(material.getManufacturer());
            entity.setSupplierName(material.getSupplierName());
            entity.setRegistrationNumber(material.getRegistrationNumber());
            entity.setUnitPrice(material.getPurchasePrice());
            entity.setQuantity(item.getQuantity());
            entity.setReceivedQuantity(0);
            entity.setStockedQuantity(0);
            entity.setAmount(material.getPurchasePrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            entity.setStatus(ScmConstants.PURCHASE_DRAFT);
            entity.setCreateTime(LocalDateTime.now());
            entity.setUpdateTime(LocalDateTime.now());
            entities.add(entity);
            totalAmount = totalAmount.add(entity.getAmount());
        }
        if (persist) {
            for (PurchaseOrderItemEntity entity : entities) {
                entity.setPurchaseOrderId(order.getId());
                purchaseOrderItemMapper.insert(entity);
            }
        }
        return totalAmount;
    }

    private String resolveSupplierCode(Long supplierId) {
        SupplierEntity supplier = supplierMapper.selectById(supplierId);
        return supplier == null ? null : supplier.getSupplierCode();
    }

    private void createExceptionOrder(PurchaseOrderEntity order, PurchaseOrderItemEntity item,
                                      String reason, LocalDate actualDeliveryDate) {
        ExceptionOrderEntity entity = new ExceptionOrderEntity();
        entity.setOrderNo(order.getOrderNumber());
        entity.setPurchaseOrderId(order.getId());
        entity.setSupplierName(order.getSupplierName());
        entity.setSupplierCode(resolveSupplierCode(order.getSupplierId()));
        entity.setDepartment(order.getDepartmentName());
        entity.setBuyer(order.getOperatorName());
        entity.setContactPerson(order.getOperatorName());
        entity.setContactPhone(null);
        entity.setOrderDate(order.getCreateTime() == null ? LocalDate.now() : order.getCreateTime().toLocalDate());
        entity.setExpectedDeliveryDate(order.getCreateTime() == null ? LocalDate.now() : order.getCreateTime().toLocalDate().plusDays(3));
        entity.setActualDeliveryDate(actualDeliveryDate);
        entity.setStatus("已拒收");
        entity.setRejectReason(reason);
        entity.setTotalAmount(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity() - item.getReceivedQuantity())));
        entity.setCreatedAt(LocalDateTime.now());
        exceptionOrderMapper.insert(entity);
    }

    private ScmView.PurchaseOrderItemDetail toOrderItemDetail(PurchaseOrderItemEntity entity) {
        ScmView.PurchaseOrderItemDetail detail = new ScmView.PurchaseOrderItemDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }

    private ScmView.PurchaseReceiveItemDetail toReceiptItemDetail(PurchaseReceiveItemEntity entity) {
        ScmView.PurchaseReceiveItemDetail detail = new ScmView.PurchaseReceiveItemDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }
}