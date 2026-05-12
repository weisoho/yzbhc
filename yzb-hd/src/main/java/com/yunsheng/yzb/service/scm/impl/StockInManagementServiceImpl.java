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
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderItemEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveItemEntity;
import com.yunsheng.yzb.model.scm.StockInItemEntity;
import com.yunsheng.yzb.model.scm.StockInOrderEntity;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryTransactionMapper;
import com.yunsheng.yzb.mapper.scm.MaterialMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseOrderItemMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseOrderMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseReceiveItemMapper;
import com.yunsheng.yzb.mapper.scm.PurchaseReceiveMapper;
import com.yunsheng.yzb.mapper.scm.StockInItemMapper;
import com.yunsheng.yzb.mapper.scm.StockInOrderMapper;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.StockInManagementService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class StockInManagementServiceImpl implements StockInManagementService {

    @Resource
    private StockInOrderMapper stockInOrderMapper;

    @Resource
    private StockInItemMapper stockInItemMapper;

    @Resource
    private PurchaseReceiveMapper purchaseReceiveMapper;

    @Resource
    private PurchaseReceiveItemMapper purchaseReceiveItemMapper;

    @Resource
    private PurchaseOrderMapper purchaseOrderMapper;

    @Resource
    private PurchaseOrderItemMapper purchaseOrderItemMapper;

    @Resource
    private InventoryMapper inventoryMapper;

    @Resource
    private InventoryTransactionMapper inventoryTransactionMapper;

    @Resource
    private MaterialMapper materialMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public PageResult<StockInOrderEntity> queryStockInOrders(ScmRequest.StockInQuery query) {
        LambdaQueryWrapper<StockInOrderEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getStockInNumber()), StockInOrderEntity::getStockInNumber, query.getStockInNumber())
                .like(StringUtils.hasText(query.getOrderNumber()), StockInOrderEntity::getOrderNumber, query.getOrderNumber())
                .like(StringUtils.hasText(query.getSupplier()), StockInOrderEntity::getSupplierName, query.getSupplier())
                .eq(StringUtils.hasText(query.getStockInType()), StockInOrderEntity::getStockInType, query.getStockInType())
                .eq(StringUtils.hasText(query.getStatus()), StockInOrderEntity::getStatus, query.getStatus());

        boolean hasItemFilter = StringUtils.hasText(query.getProductCode()) 
                || StringUtils.hasText(query.getProductName())
                || StringUtils.hasText(query.getManufacturer());
        
        if (hasItemFilter) {
            wrapper.and(w -> w.exists("SELECT 1 FROM scm_stock_in_item sii WHERE sii.stock_in_order_id = scm_stock_in_order.id " +
                    (StringUtils.hasText(query.getProductCode()) ? "AND sii.material_code LIKE CONCAT('%', '" + query.getProductCode() + "', '%') " : "") +
                    (StringUtils.hasText(query.getProductName()) ? "AND sii.material_name LIKE CONCAT('%', '" + query.getProductName() + "', '%') " : "") +
                    (StringUtils.hasText(query.getManufacturer()) ? "AND sii.manufacturer LIKE CONCAT('%', '" + query.getManufacturer() + "', '%') " : "")
            ));
        }

        wrapper.orderByDesc(StockInOrderEntity::getCreateTime);
        Page<StockInOrderEntity> page = stockInOrderMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public PageResult<StockInItemEntity> queryStockInItems(ScmRequest.StockInQuery query) {
        LambdaQueryWrapper<StockInItemEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(query.getProductCode()), StockInItemEntity::getMaterialCode, query.getProductCode())
                .like(StringUtils.hasText(query.getProductName()), StockInItemEntity::getMaterialName, query.getProductName())
                .like(StringUtils.hasText(query.getSupplier()), StockInItemEntity::getSupplierName, query.getSupplier())
                .like(StringUtils.hasText(query.getManufacturer()), StockInItemEntity::getManufacturer, query.getManufacturer());

        if (StringUtils.hasText(query.getStockInType())) {
            List<Long> stockInOrderIds = stockInOrderMapper.selectList(new LambdaQueryWrapper<StockInOrderEntity>()
                            .eq(StockInOrderEntity::getStockInType, query.getStockInType()))
                    .stream()
                    .map(StockInOrderEntity::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            if (stockInOrderIds.isEmpty()) {
                return new PageResult<>(query.getPageNum(), query.getPageSize(), 0, Collections.emptyList());
            }
            wrapper.in(StockInItemEntity::getStockInOrderId, stockInOrderIds);
        }
        
        wrapper.orderByDesc(StockInItemEntity::getCreateTime);
        Page<StockInItemEntity> page = stockInItemMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    @Override
    public ScmView.StockInDetail getStockInDetail(Long stockInOrderId) {
        StockInOrderEntity order = stockInOrderMapper.selectById(stockInOrderId);
        if (order == null) {
            throw new ScmBusinessException("入库单不存在");
        }
        List<StockInItemEntity> items = stockInItemMapper.selectList(new LambdaQueryWrapper<StockInItemEntity>()
                .eq(StockInItemEntity::getStockInOrderId, stockInOrderId)
                .orderByAsc(StockInItemEntity::getId));
        ScmView.StockInDetail detail = new ScmView.StockInDetail();
        BeanUtils.copyProperties(order, detail);
        detail.setSupplier(order.getSupplierName());
        detail.setItems(items.stream().map(this::toStockInDetailItem).collect(Collectors.toList()));
        return detail;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StockInOrderEntity createStockIn(Long receiptId, ScmRequest.StockInSave request) {
        PurchaseReceiveEntity receipt = purchaseReceiveMapper.selectById(receiptId);
        if (receipt == null) {
            throw new ScmBusinessException("收货单不存在");
        }
        if (!Objects.equals(receipt.getStatus(), ScmConstants.RECEIPT_WAIT_STOCK_IN)) {
            throw new ScmBusinessException("当前收货单不允许入库");
        }
        List<PurchaseReceiveItemEntity> receiveItems = purchaseReceiveItemMapper.selectList(new LambdaQueryWrapper<PurchaseReceiveItemEntity>()
                .eq(PurchaseReceiveItemEntity::getReceiveId, receiptId));
        Map<Long, PurchaseReceiveItemEntity> receiveItemMap = receiveItems.stream()
                .collect(Collectors.toMap(PurchaseReceiveItemEntity::getId, item -> item));

        StockInOrderEntity order = new StockInOrderEntity();
        order.setStockInNumber(ScmCodeGenerator.nextCode(stockInOrderMapper, "SI", "stock_in_number"));
        order.setReceiveId(receiptId);
        order.setReceiveNumber(receipt.getReceiveNumber());
        order.setPurchaseOrderId(receipt.getPurchaseOrderId());
        order.setOrderNumber(receipt.getOrderNumber());
        order.setStockInType(request.getStockInType());
        order.setDepartmentName(receipt.getDepartmentName());
        order.setOperatorName(request.getOperatorName());
        order.setSupplierName(receipt.getSupplierName());
        order.setStockInDate(LocalDate.now());
        order.setStatus(ScmConstants.STOCK_IN_COMPLETED);
        order.setRemark(request.getRemark());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        stockInOrderMapper.insert(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        int materialCount = 0;
        for (ScmRequest.StockInItemSave itemRequest : request.getItems()) {
            PurchaseReceiveItemEntity receiveItem = receiveItemMap.get(itemRequest.getReceiveItemId());
            if (receiveItem == null) {
                throw new ScmBusinessException("存在无效的收货明细");
            }
            int pendingQuantity = receiveItem.getActualReceivedQuantity() - alreadyStockedQuantity(receiveItem.getId());
            if (itemRequest.getStockInQuantity() > pendingQuantity) {
                throw new ScmBusinessException("入库数量不能超过待入库数量");
            }
            StockInItemEntity itemEntity = new StockInItemEntity();
            BeanUtils.copyProperties(itemRequest, itemEntity);
            itemEntity.setStockInOrderId(order.getId());
            itemEntity.setReceiveItemId(receiveItem.getId());
            itemEntity.setPurchaseAmount(itemRequest.getPurchasePrice().multiply(BigDecimal.valueOf(itemRequest.getStockInQuantity())));
            itemEntity.setSupplierName(itemRequest.getSupplierName());
            itemEntity.setStatus(ScmConstants.STOCK_IN_COMPLETED);
            itemEntity.setCreateTime(LocalDateTime.now());
            itemEntity.setUpdateTime(LocalDateTime.now());
            stockInItemMapper.insert(itemEntity);
            totalAmount = totalAmount.add(itemEntity.getPurchaseAmount());
            materialCount++;
            syncInventory(itemEntity, order);
            syncPurchaseProgress(receiveItem.getPurchaseOrderItemId(), itemRequest.getStockInQuantity());
        }

        order.setTotalAmount(totalAmount);
        order.setMaterialCount(materialCount);
        stockInOrderMapper.updateById(order);
        receipt.setStatus(ScmConstants.RECEIPT_COMPLETED);
        receipt.setUpdateTime(LocalDateTime.now());
        purchaseReceiveMapper.updateById(receipt);
        refreshPurchaseOrderAfterStockIn(receipt.getPurchaseOrderId());
        operationLogService.save(request.getOperatorName(), "入库", "完成入库: " + order.getStockInNumber(),
                ScmConstants.LOG_SUCCESS, "入库管理", order.getStockInNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StockInOrderEntity createManualStockIn(ScmRequest.StockInSave request) {
        StockInOrderEntity order = new StockInOrderEntity();
        String departmentName = StringUtils.hasText(request.getDepartmentName()) ? request.getDepartmentName() : "默认仓库";
        order.setStockInNumber(ScmCodeGenerator.nextCode(stockInOrderMapper, "SI", "stock_in_number"));
        order.setStockInType(request.getStockInType());
        order.setDepartmentName(departmentName);
        order.setOperatorName(request.getOperatorName());
        order.setStockInDate(LocalDate.now());
        order.setStatus(ScmConstants.STOCK_IN_COMPLETED);
        order.setRemark(request.getRemark());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        if (!request.getItems().isEmpty()) {
            order.setSupplierName(request.getItems().get(0).getSupplierName());
        }
        
        stockInOrderMapper.insert(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        int materialCount = 0;
        for (ScmRequest.StockInItemSave itemRequest : request.getItems()) {
            StockInItemEntity itemEntity = new StockInItemEntity();
            BeanUtils.copyProperties(itemRequest, itemEntity);
            itemEntity.setStockInOrderId(order.getId());
            itemEntity.setPurchaseAmount(itemRequest.getPurchasePrice().multiply(BigDecimal.valueOf(itemRequest.getStockInQuantity())));
            itemEntity.setStatus(ScmConstants.STOCK_IN_COMPLETED);
            itemEntity.setCreateTime(LocalDateTime.now());
            itemEntity.setUpdateTime(LocalDateTime.now());
            stockInItemMapper.insert(itemEntity);
            
            totalAmount = totalAmount.add(itemEntity.getPurchaseAmount());
            materialCount++;
            syncInventory(itemEntity, order);
        }

        order.setTotalAmount(totalAmount);
        order.setMaterialCount(materialCount);
        stockInOrderMapper.updateById(order);
        
        operationLogService.save(request.getOperatorName(), "初始化入库", "完成手动入库: " + order.getStockInNumber(),
                ScmConstants.LOG_SUCCESS, "入库管理", order.getStockInNumber());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StockInOrderEntity updateStockIn(Long stockInOrderId, ScmRequest.StockInSave request) {
        throw new ScmBusinessException("已完成入库单暂不支持修改，请通过冲销后重新录入");
    }

    @Override
    public PageResult<ScmView.PendingStockInItem> queryPendingStockInItems(ScmRequest.StockInQuery query) {
        List<PurchaseReceiveEntity> receipts = purchaseReceiveMapper.selectList(new LambdaQueryWrapper<PurchaseReceiveEntity>()
                .eq(PurchaseReceiveEntity::getStatus, ScmConstants.RECEIPT_WAIT_STOCK_IN)
                .orderByDesc(PurchaseReceiveEntity::getCreateTime));
        List<Long> receiveIds = receipts.stream().map(PurchaseReceiveEntity::getId).collect(Collectors.toList());
        if (receiveIds.isEmpty()) {
            return new PageResult<>(query.getPageNum(), query.getPageSize(), 0, java.util.Collections.emptyList());
        }
        Map<Long, PurchaseReceiveEntity> receiptMap = receipts.stream().collect(Collectors.toMap(PurchaseReceiveEntity::getId, item -> item));
        List<PurchaseReceiveItemEntity> items = purchaseReceiveItemMapper.selectList(new LambdaQueryWrapper<PurchaseReceiveItemEntity>()
                .in(PurchaseReceiveItemEntity::getReceiveId, receiveIds));
        List<ScmView.PendingStockInItem> records = items.stream()
                .map(item -> toPendingItem(item, receiptMap.get(item.getReceiveId())))
                .filter(item -> item.getPendingQuantity() > 0)
                .filter(item -> !StringUtils.hasText(query.getOrderNumber()) || item.getOrderNumber().contains(query.getOrderNumber()))
                .filter(item -> !StringUtils.hasText(query.getProductCode()) || item.getProductCode().contains(query.getProductCode()))
                .filter(item -> !StringUtils.hasText(query.getProductName()) || item.getProductName().contains(query.getProductName()))
                .filter(item -> !StringUtils.hasText(query.getSupplier()) || item.getSupplierName().contains(query.getSupplier()))
                .filter(item -> !StringUtils.hasText(query.getManufacturer()) || item.getManufacturer().contains(query.getManufacturer()))
                .sorted(Comparator.comparing(ScmView.PendingStockInItem::getReceiveId).reversed())
                .collect(Collectors.toList());
        long startIndex = Math.max(0, (query.getPageNum() - 1) * query.getPageSize());
        long endIndex = Math.min(records.size(), startIndex + query.getPageSize());
        List<ScmView.PendingStockInItem> pageRecords = startIndex >= records.size()
                ? java.util.Collections.emptyList() : records.subList((int) startIndex, (int) endIndex);
        return new PageResult<>(query.getPageNum(), query.getPageSize(), records.size(), pageRecords);
    }

    private int alreadyStockedQuantity(Long receiveItemId) {
        return stockInItemMapper.selectList(new LambdaQueryWrapper<StockInItemEntity>()
                        .eq(StockInItemEntity::getReceiveItemId, receiveItemId))
                .stream()
                .map(StockInItemEntity::getStockInQuantity)
                .filter(Objects::nonNull)
                .reduce(0, Integer::sum);
    }

    private void syncPurchaseProgress(Long purchaseOrderItemId, Integer stockInQuantity) {
        PurchaseOrderItemEntity orderItem = purchaseOrderItemMapper.selectById(purchaseOrderItemId);
        orderItem.setStockedQuantity((orderItem.getStockedQuantity() == null ? 0 : orderItem.getStockedQuantity()) + stockInQuantity);
        orderItem.setStatus(orderItem.getStockedQuantity() >= orderItem.getReceivedQuantity() ? "已入库" : "部分入库");
        orderItem.setUpdateTime(LocalDateTime.now());
        purchaseOrderItemMapper.updateById(orderItem);
    }

    private void refreshPurchaseOrderAfterStockIn(Long purchaseOrderId) {
        PurchaseOrderEntity order = purchaseOrderMapper.selectById(purchaseOrderId);
        List<PurchaseOrderItemEntity> items = purchaseOrderItemMapper.selectList(new LambdaQueryWrapper<PurchaseOrderItemEntity>()
                .eq(PurchaseOrderItemEntity::getPurchaseOrderId, purchaseOrderId));
        boolean finished = items.stream().allMatch(item -> Objects.equals(item.getReceivedQuantity(), item.getStockedQuantity()));
        order.setStatus(finished ? ScmConstants.PURCHASE_COMPLETED : ScmConstants.PURCHASE_WAIT_STOCK_IN);
        order.setUpdateTime(LocalDateTime.now());
        purchaseOrderMapper.updateById(order);
    }

    private void syncInventory(StockInItemEntity stockInItem, StockInOrderEntity order) {
        String warehouse = StringUtils.hasText(order.getDepartmentName()) ? order.getDepartmentName() : "默认仓库";
        String minPackageStr = stockInItem.getMinPackage();
        int parsedPerPackage = parsePackageCount(minPackageStr);
        String baseUnit = parseBaseUnit(minPackageStr);
        String packageUnit = parsePackageUnit(minPackageStr);

        List<InventoryEntity> existingRows = inventoryMapper.selectList(new LambdaQueryWrapper<InventoryEntity>()
                .eq(InventoryEntity::getMaterialCode, stockInItem.getMaterialCode())
                .eq(InventoryEntity::getBatchNumber, stockInItem.getBatchNumber())
                .eq(InventoryEntity::getWarehouse, warehouse));

        if (existingRows == null || existingRows.isEmpty()) {
            newInventoryWithUniqueCodes(stockInItem, order, warehouse, minPackageStr, parsedPerPackage, baseUnit, packageUnit);
        } else {
            addNewPackageRows(stockInItem, order, warehouse, minPackageStr, parsedPerPackage, baseUnit, packageUnit, existingRows);
        }
    }

    private void newInventoryWithUniqueCodes(StockInItemEntity stockInItem, StockInOrderEntity order,
                                              String warehouse, String minPackageStr,
                                              int perPackageCount, String baseUnit, String packageUnit) {
        int totalQty = stockInItem.getStockInQuantity();
        MaterialEntity material = materialMapper.selectById(stockInItem.getMaterialId());

        if (perPackageCount > 0 && totalQty >= perPackageCount) {
            int fullPackages = totalQty / perPackageCount;
            int remainder = totalQty % perPackageCount;
            for (int i = 0; i < fullPackages; i++) {
                insertInventoryRow(stockInItem, order, warehouse, perPackageCount, packageUnit,
                        generateUniqueCode(), material, false);
            }
            if (remainder > 0) {
                insertInventoryRow(stockInItem, order, warehouse, remainder, baseUnit,
                        generateUniqueCode(), material, false);
            }
        } else {
            insertInventoryRow(stockInItem, order, warehouse, totalQty, stockInItem.getUnit(),
                    generateUniqueCode(), material, true);
        }
    }

    private void addNewPackageRows(StockInItemEntity stockInItem, StockInOrderEntity order,
                                    String warehouse, String minPackageStr,
                                    int perPackageCount, String baseUnit, String packageUnit,
                                    List<InventoryEntity> existingRows) {
        InventoryEntity master = existingRows.stream()
                .filter(r -> !StringUtils.hasText(r.getUniqueCode()))
                .findFirst()
                .orElse(existingRows.get(0));

        master.setCurrentStock((master.getCurrentStock() == null ? 0 : master.getCurrentStock()) + stockInItem.getStockInQuantity());
        master.setPurchasePrice(stockInItem.getPurchasePrice());
        master.setLastInbound(LocalDate.now());
        master.setUpdateTime(LocalDateTime.now());
        ScmInventorySupport.refreshStatus(master);
        inventoryMapper.updateById(master);

        int totalQty = stockInItem.getStockInQuantity();
        MaterialEntity material = materialMapper.selectById(stockInItem.getMaterialId());
        if (perPackageCount > 0 && totalQty >= perPackageCount) {
            int fullPackages = totalQty / perPackageCount;
            int remainder = totalQty % perPackageCount;
            for (int i = 0; i < fullPackages; i++) {
                insertInventoryRow(stockInItem, order, warehouse, perPackageCount, packageUnit,
                        generateUniqueCode(), material, false);
            }
            if (remainder > 0) {
                insertInventoryRow(stockInItem, order, warehouse, remainder, baseUnit,
                        generateUniqueCode(), material, false);
            }
        } else {
            for (int i = 0; i < totalQty; i++) {
                insertInventoryRow(stockInItem, order, warehouse, 1, stockInItem.getUnit(),
                        generateUniqueCode(), material, true);
            }
        }

        InventoryTransactionEntity transaction = new InventoryTransactionEntity();
        transaction.setInventoryId(master.getId());
        transaction.setMaterialId(master.getMaterialId());
        transaction.setMaterialCode(master.getMaterialCode());
        transaction.setMaterialName(master.getMaterialName());
        transaction.setBatchNumber(master.getBatchNumber());
        transaction.setOperationType("入库");
        transaction.setQuantity(stockInItem.getStockInQuantity());
        transaction.setBalanceQuantity(master.getCurrentStock());
        transaction.setReferenceNo(order.getStockInNumber());
        transaction.setOperatorName(order.getOperatorName());
        transaction.setRemark(stockInItem.getRemark());
        transaction.setOperationTime(LocalDateTime.now());
        inventoryTransactionMapper.insert(transaction);
    }

    private void insertInventoryRow(StockInItemEntity stockInItem, StockInOrderEntity order,
                                     String warehouse, int quantity, String unit,
                                     String uniqueCode, MaterialEntity material, boolean isStandalone) {
        InventoryEntity inventory = new InventoryEntity();
        inventory.setMaterialId(stockInItem.getMaterialId());
        inventory.setMaterialCode(stockInItem.getMaterialCode());
        inventory.setMaterialName(stockInItem.getMaterialName());
        inventory.setCategory(stockInItem.getMaterialType());
        inventory.setSpecification(stockInItem.getSpecification());
        inventory.setModel(stockInItem.getModel());
        inventory.setWarehouse(warehouse);
        inventory.setShelf("默认货位");
        inventory.setBatchNumber(stockInItem.getBatchNumber());
        inventory.setUniqueCode(uniqueCode);
        inventory.setProductionDate(stockInItem.getProductionDate());
        inventory.setExpiryDate(stockInItem.getExpiryDate());
        inventory.setMinPackage(stockInItem.getMinPackage());
        inventory.setUnit(unit);
        inventory.setPurchasePrice(stockInItem.getPurchasePrice());
        inventory.setCurrentStock(quantity);
        inventory.setMinStock(isStandalone ? 10 : null);
        inventory.setMaxStock(isStandalone ? 1000 : null);
        inventory.setExpiryWarningDays(isStandalone ? 90 : null);
        inventory.setRegistrationNumber(stockInItem.getRegistrationNumber());
        inventory.setSupplier(stockInItem.getSupplierName());
        inventory.setManufacturer(stockInItem.getManufacturer());
        inventory.setLastInbound(LocalDate.now());
        inventory.setCreateTime(LocalDateTime.now());
        inventory.setUpdateTime(LocalDateTime.now());
        if (isStandalone) {
            ScmInventorySupport.refreshStatus(inventory);
        } else {
            inventory.setStockStatus(null);
            inventory.setWarning(null);
        }
        inventoryMapper.insert(inventory);

        if (isStandalone) {
            InventoryTransactionEntity transaction = new InventoryTransactionEntity();
            transaction.setInventoryId(inventory.getId());
            transaction.setMaterialId(inventory.getMaterialId());
            transaction.setMaterialCode(inventory.getMaterialCode());
            transaction.setMaterialName(inventory.getMaterialName());
            transaction.setBatchNumber(inventory.getBatchNumber());
            transaction.setOperationType("入库");
            transaction.setQuantity(quantity);
            transaction.setBalanceQuantity(inventory.getCurrentStock());
            transaction.setReferenceNo(order.getStockInNumber());
            transaction.setOperatorName(order.getOperatorName());
            transaction.setRemark(stockInItem.getRemark());
            transaction.setOperationTime(LocalDateTime.now());
            inventoryTransactionMapper.insert(transaction);
        }
    }

    private int parsePackageCount(String minPackage) {
        if (!StringUtils.hasText(minPackage)) {
            return 0;
        }
        try {
            String cleaned = minPackage.trim().replaceAll("[^0-9/]", "");
            if (cleaned.contains("/")) {
                String[] parts = cleaned.split("/");
                if (parts.length == 2 && parts[0].length() > 0) {
                    return Integer.parseInt(parts[0]);
                }
            }
            String digits = minPackage.replaceAll("[^0-9]", "");
            if (digits.length() > 0) {
                return Integer.parseInt(digits);
            }
        } catch (NumberFormatException ignored) {
        }
        return 0;
    }

    private String parseBaseUnit(String minPackage) {
        if (!StringUtils.hasText(minPackage)) {
            return "";
        }
        String cleaned = minPackage.trim();
        if (cleaned.contains("/")) {
            int slashIdx = cleaned.indexOf("/");
            String beforeSlash = cleaned.substring(0, slashIdx);
            String unitPart = beforeSlash.replaceAll("[0-9]", "").trim();
            if (unitPart.length() > 0) {
                return unitPart;
            }
            return beforeSlash.replaceAll("[0-9]", "").trim();
        }
        return "";
    }

    private String parsePackageUnit(String minPackage) {
        if (!StringUtils.hasText(minPackage)) {
            return "";
        }
        String cleaned = minPackage.trim();
        if (cleaned.contains("/")) {
            return cleaned.substring(cleaned.indexOf("/") + 1).trim();
        }
        return "";
    }

    private String generateUniqueCode() {
        String datePart = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = String.format("%06d", (int) (Math.random() * 1000000));
        return "SN" + datePart + randomSuffix;
    }

    private ScmView.StockInItemDetail toStockInDetailItem(StockInItemEntity entity) {
        ScmView.StockInItemDetail detail = new ScmView.StockInItemDetail();
        BeanUtils.copyProperties(entity, detail);
        detail.setSupplier(entity.getSupplierName());
        return detail;
    }

    private ScmView.PendingStockInItem toPendingItem(PurchaseReceiveItemEntity item, PurchaseReceiveEntity receipt) {
        ScmView.PendingStockInItem detail = new ScmView.PendingStockInItem();
        detail.setId(item.getId());
        detail.setReceiveId(item.getReceiveId());
        detail.setReceiveNumber(receipt.getReceiveNumber());
        detail.setReceiveItemId(item.getId());
        detail.setOrderNumber(receipt.getOrderNumber());
        detail.setProductCode(item.getProductCode());
        detail.setProductName(item.getProductName());
        detail.setSpecification(item.getSpecification());
        detail.setModel(item.getModel());
        detail.setManufacturer(item.getManufacturer());
        detail.setSupplierName(receipt.getSupplierName());
        detail.setRegistrationNumber(item.getRegistrationNumber());
        detail.setOrderQuantity(item.getQuantity());
        detail.setReceivedQuantity(item.getActualReceivedQuantity());
        detail.setPendingQuantity(item.getActualReceivedQuantity() - alreadyStockedQuantity(item.getId()));
        detail.setOrderUnit(item.getUnit());
        detail.setPurchasePrice(item.getPrice());
        detail.setPurchaseAmount(item.getPrice().multiply(BigDecimal.valueOf(detail.getPendingQuantity())));
        detail.setDepartment(receipt.getDepartmentName());
        detail.setStatus(receipt.getStatus());
        return detail;
    }
}
