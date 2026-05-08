package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.mapper.WarehouseMapper;
import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryTransactionMapper;
import com.yunsheng.yzb.mapper.scm.MaterialMapper;
import com.yunsheng.yzb.mapper.scm.TransferOrderItemMapper;
import com.yunsheng.yzb.mapper.scm.TransferOrderMapper;
import com.yunsheng.yzb.mapper.scm.TransferOrderExtMapper;
import com.yunsheng.yzb.common.ScmBusinessException;
import com.yunsheng.yzb.common.ScmInventorySupport;
import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.model.Warehouse;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.model.scm.ScmTransferOrder;
import com.yunsheng.yzb.model.scm.ScmTransferOrderItem;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.service.scm.TransferManagementService;
import com.yunsheng.yzb.vo.TransferAcceptanceItemVO;
import com.yunsheng.yzb.vo.TransferAcceptanceVO;
import com.yunsheng.yzb.vo.TransferAcceptanceSave;
import com.yunsheng.yzb.vo.TransferOrderCreateSave;
import com.yunsheng.yzb.vo.TransferOrderVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 调拨管理服务实现。
 */
@Service
public class TransferManagementServiceImpl implements TransferManagementService {

    @Resource
    private TransferOrderExtMapper transferOrderExtMapper;

    @Resource
    private WarehouseMapper warehouseMapper;

    @Resource
    private SysDepartmentMapper departmentMapper;

    @Resource
    private TransferOrderMapper transferOrderMapper;

    @Resource
    private TransferOrderItemMapper transferOrderItemMapper;

    @Resource
    private InventoryMapper inventoryMapper;

    @Resource
    private InventoryTransactionMapper inventoryTransactionMapper;

    @Resource
    private MaterialMapper materialMapper;

    @Resource
    private OperationLogService operationLogService;

    @Override
    public Map<String, Object> getTransferOrders(String transferNumber, String fromWarehouse, String toWarehouse, int pageNum, int pageSize) {
        // 计算偏移量
        int offset = (pageNum - 1) * pageSize;

        // 查询调拨单列表
        List<TransferOrderVO> records = transferOrderExtMapper.selectTransferOrderList(
                transferNumber, fromWarehouse, toWarehouse, offset, pageSize
        );

        // 查询总记录数
        int total = transferOrderExtMapper.selectTransferOrderCount(
                transferNumber, fromWarehouse, toWarehouse
        );

        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("records", records);
        result.put("total", total);
        result.put("pageNum", pageNum);
        result.put("pageSize", pageSize);

        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> createTransferOrder(TransferOrderCreateSave request) {
        if (!StringUtils.hasText(request.getFromWarehouse())) {
            throw new ScmBusinessException("调出仓库不能为空");
        }
        if (!StringUtils.hasText(request.getToWarehouse())) {
            throw new ScmBusinessException("调入仓库不能为空");
        }
        if (Objects.equals(request.getFromWarehouse(), request.getToWarehouse())) {
            throw new ScmBusinessException("调入仓库不能与调出仓库相同");
        }
        if (!StringUtils.hasText(request.getOperatorName())) {
            throw new ScmBusinessException("调拨人不能为空");
        }
        if (!StringUtils.hasText(request.getTransferDate())) {
            throw new ScmBusinessException("调拨日期不能为空");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ScmBusinessException("请选择至少一条调拨明细");
        }

        ScmTransferOrder order = new ScmTransferOrder();
        order.setTransferNumber(ScmCodeGenerator.nextCode(transferOrderMapper, "TR", "transfer_number"));
        order.setFromDepartmentName(request.getFromWarehouse());
        order.setToDepartmentName(request.getToWarehouse());
        order.setStatus("pending");
        order.setOperatorName(request.getOperatorName());
        order.setTransferDate(java.sql.Date.valueOf(request.getTransferDate()));
        order.setCreateTime(new Date());
        transferOrderMapper.insert(order);

        for (TransferOrderCreateSave.Item requestItem : request.getItems()) {
            InventoryEntity inventory = inventoryMapper.selectById(requestItem.getInventoryId());
            if (inventory == null) {
                throw new ScmBusinessException("存在无效的库存记录");
            }
            if (!request.getFromWarehouse().equals(inventory.getWarehouse())) {
                throw new ScmBusinessException("所选库存与调出仓库不一致");
            }
            int currentStock = inventory.getCurrentStock() == null ? 0 : inventory.getCurrentStock();
            if (requestItem.getQuantity() == null || requestItem.getQuantity() <= 0) {
                throw new ScmBusinessException("调拨数量必须大于0");
            }
            if (requestItem.getQuantity() > currentStock) {
                throw new ScmBusinessException("库存不足，无法发起调拨");
            }

            ScmTransferOrderItem item = new ScmTransferOrderItem();
            item.setTransferOrderId(order.getId());
            item.setMaterialId(inventory.getMaterialId());
            item.setMaterialCode(inventory.getMaterialCode());
            item.setMaterialName(inventory.getMaterialName());
            item.setSpecification(inventory.getSpecification());
            item.setModel(inventory.getModel());
            item.setUnit(inventory.getUnit());
            item.setManufacturer(inventory.getManufacturer());
            item.setSupplier(inventory.getSupplier());
            item.setRegistrationNumber(inventory.getRegistrationNumber());
            item.setBatchNumber(inventory.getBatchNumber());
            item.setProductionDate(toDate(inventory.getProductionDate()));
            item.setExpiryDate(toDate(inventory.getExpiryDate()));
            item.setTransferQuantity(requestItem.getQuantity());
            item.setAcceptanceStatus("pending");
            item.setAcceptedQuantity(0);
            transferOrderItemMapper.insert(item);

            inventory.setCurrentStock(currentStock - requestItem.getQuantity());
            inventory.setUpdateTime(LocalDateTime.now());
            ScmInventorySupport.refreshStatus(inventory);
            inventoryMapper.updateById(inventory);

            InventoryTransactionEntity transaction = new InventoryTransactionEntity();
            transaction.setInventoryId(inventory.getId());
            transaction.setMaterialId(inventory.getMaterialId());
            transaction.setMaterialCode(inventory.getMaterialCode());
            transaction.setMaterialName(inventory.getMaterialName());
            transaction.setBatchNumber(inventory.getBatchNumber());
            transaction.setOperationType("调拨出库");
            transaction.setQuantity(-requestItem.getQuantity());
            transaction.setBalanceQuantity(inventory.getCurrentStock());
            transaction.setReferenceNo(order.getTransferNumber());
            transaction.setOperatorName(request.getOperatorName());
            transaction.setRemark(StringUtils.hasText(request.getRemark()) ? request.getRemark() : "调拨出库");
            transaction.setOperationTime(LocalDateTime.now());
            inventoryTransactionMapper.insert(transaction);
        }

        operationLogService.save(request.getOperatorName(), "调拨", "创建调拨单: " + order.getTransferNumber(),
                "success", "调拨管理", order.getTransferNumber());

        Map<String, Object> result = new HashMap<>();
        result.put("id", order.getId());
        result.put("transferNumber", order.getTransferNumber());
        return result;
    }

    @Override
    public List<Map<String, String>> getWarehouseList() {
        Set<String> warehouseNames = new LinkedHashSet<>();

        warehouseMapper.selectByExample(null).stream()
                .map(Warehouse::getWareName)
                .filter(StringUtils::hasText)
                .map(String::trim)
                .forEach(warehouseNames::add);

        inventoryMapper.selectList(new LambdaQueryWrapper<InventoryEntity>()
                        .select(InventoryEntity::getWarehouse)
                        .isNotNull(InventoryEntity::getWarehouse)
                        .gt(InventoryEntity::getCurrentStock, 0))
                .stream()
                .map(InventoryEntity::getWarehouse)
                .filter(StringUtils::hasText)
                .map(String::trim)
                .forEach(warehouseNames::add);

        departmentMapper.selectAll().stream()
                .filter(item -> item != null && !Objects.equals(item.getIsDeleted(), 1) && !"CAMPUS".equalsIgnoreCase(item.getOrgType()))
                .map(SysDepartment::getDeptName)
                .filter(StringUtils::hasText)
                .map(String::trim)
                .forEach(warehouseNames::add);

        return warehouseNames.stream()
                .map(name -> {
                    Map<String, String> warehouseMap = new HashMap<>();
                    warehouseMap.put("value", name);
                    warehouseMap.put("label", name);
                    return warehouseMap;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getTransferAcceptanceOrders(String transferNumber,
                                                           String fromWarehouse,
                                                           String toWarehouse,
                                                           String acceptanceStatus,
                                                           String startDate,
                                                           String endDate,
                                                           int pageNum,
                                                           int pageSize) {
        int offset = (pageNum - 1) * pageSize;
        List<TransferAcceptanceVO> records = transferOrderExtMapper.selectTransferAcceptanceList(
                transferNumber, fromWarehouse, toWarehouse, acceptanceStatus, startDate, endDate, offset, pageSize
        );
        int total = transferOrderExtMapper.selectTransferAcceptanceCount(
                transferNumber, fromWarehouse, toWarehouse, acceptanceStatus, startDate, endDate
        );
        Map<String, Object> result = new HashMap<>();
        result.put("records", records);
        result.put("total", total);
        result.put("pageNum", pageNum);
        result.put("pageSize", pageSize);
        return result;
    }

    @Override
    public List<TransferAcceptanceItemVO> getTransferAcceptanceDetail(String transferNumber) {
        if (!StringUtils.hasText(transferNumber)) {
            return Collections.emptyList();
        }
        return transferOrderExtMapper.selectTransferAcceptanceDetail(transferNumber);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> acceptTransfer(String transferNumber, List<TransferAcceptanceSave.Item> items, String acceptor, String acceptanceDate) {
        return updateAcceptance(transferNumber, items, acceptor, acceptanceDate, "accepted");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> rejectTransfer(String transferNumber, List<TransferAcceptanceSave.Item> items, String acceptor, String acceptanceDate) {
        return updateAcceptance(transferNumber, items, acceptor, acceptanceDate, "rejected");
    }

    private Map<String, Object> updateAcceptance(String transferNumber,
                                                 List<TransferAcceptanceSave.Item> items,
                                                 String acceptor,
                                                 String acceptanceDate,
                                                 String targetStatus) {
        if (!StringUtils.hasText(transferNumber)) {
            throw new ScmBusinessException("调拨单号不能为空");
        }
        if (items == null || items.isEmpty()) {
            throw new ScmBusinessException("请选择要操作的明细");
        }
        if (!StringUtils.hasText(acceptor)) {
            throw new ScmBusinessException("验收人不能为空");
        }
        if (!StringUtils.hasText(acceptanceDate)) {
            throw new ScmBusinessException("验收日期不能为空");
        }

        ScmTransferOrder order = transferOrderMapper.selectOne(new LambdaQueryWrapper<ScmTransferOrder>()
                .eq(ScmTransferOrder::getTransferNumber, transferNumber));
        if (order == null) {
            throw new ScmBusinessException("调拨单不存在");
        }

        Date date = java.sql.Date.valueOf(acceptanceDate);
        for (TransferAcceptanceSave.Item requestItem : items) {
            if (requestItem == null || requestItem.getId() == null) {
                throw new ScmBusinessException("存在无效的调拨明细");
            }
            ScmTransferOrderItem item = transferOrderItemMapper.selectById(requestItem.getId());
            if (item == null || !item.getTransferOrderId().equals(order.getId())) {
                throw new ScmBusinessException("存在无效的调拨明细");
            }

            if ("accepted".equals(targetStatus)) {
                if ("rejected".equals(item.getAcceptanceStatus())) {
                    throw new ScmBusinessException("已拒收的明细不能验收");
                }
                Integer requestQuantity = requestItem.getQuantity();
                if (requestQuantity == null || requestQuantity <= 0) {
                    throw new ScmBusinessException("本次验收数量必须大于0");
                }
                int transferQuantity = item.getTransferQuantity() == null ? 0 : item.getTransferQuantity();
                int acceptedQuantity = item.getAcceptedQuantity() == null ? 0 : item.getAcceptedQuantity();
                int remaining = transferQuantity - acceptedQuantity;
                if (remaining <= 0) {
                    throw new ScmBusinessException("该明细已全部验收");
                }
                if (requestQuantity > remaining) {
                    throw new ScmBusinessException("本次验收数量不能超过剩余数量");
                }

                int newAcceptedQuantity = acceptedQuantity + requestQuantity;
                item.setAcceptedQuantity(newAcceptedQuantity);
                item.setAcceptanceStatus(newAcceptedQuantity == transferQuantity ? "accepted" : "partially_accepted");
                item.setAcceptor(acceptor);
                item.setAcceptanceDate(date);
                transferOrderItemMapper.updateById(item);

                syncTransferInInventory(order.getToDepartmentName(), transferNumber, item, acceptor, requestQuantity);
            } else if ("rejected".equals(targetStatus)) {
                int acceptedQuantity = item.getAcceptedQuantity() == null ? 0 : item.getAcceptedQuantity();
                if (acceptedQuantity > 0) {
                    throw new ScmBusinessException("已部分验收的明细不能拒收");
                }
                item.setAcceptanceStatus("rejected");
                item.setAcceptedQuantity(0);
                item.setAcceptor(acceptor);
                item.setAcceptanceDate(date);
                transferOrderItemMapper.updateById(item);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("transferNumber", transferNumber);
        result.put("items", getTransferAcceptanceDetail(transferNumber));
        refreshOrderStatus(order);
        return result;
    }

    private void refreshOrderStatus(ScmTransferOrder order) {
        List<ScmTransferOrderItem> orderItems = transferOrderItemMapper.selectList(new LambdaQueryWrapper<ScmTransferOrderItem>()
                .eq(ScmTransferOrderItem::getTransferOrderId, order.getId()));
        if (orderItems.isEmpty()) {
            return;
        }

        boolean allAccepted = orderItems.stream().allMatch(item -> "accepted".equals(item.getAcceptanceStatus()));
        boolean allRejected = orderItems.stream().allMatch(item -> "rejected".equals(item.getAcceptanceStatus()));
        boolean hasAccepted = orderItems.stream().anyMatch(item -> "accepted".equals(item.getAcceptanceStatus()) || "partially_accepted".equals(item.getAcceptanceStatus()));

        if (allAccepted) {
            order.setStatus("completed");
        } else if (allRejected) {
            order.setStatus("rejected");
        } else if (hasAccepted) {
            order.setStatus("partially_accepted");
        } else {
            order.setStatus("pending");
        }
        transferOrderMapper.updateById(order);
    }

    private void syncTransferInInventory(String toWarehouse,
                                         String transferNumber,
                                         ScmTransferOrderItem item,
                                         String operatorName,
                                         int quantity) {
        if (!StringUtils.hasText(toWarehouse)) {
            throw new ScmBusinessException("调入仓库不能为空");
        }

        MaterialEntity material = null;
        if (item.getMaterialId() != null) {
            material = materialMapper.selectById(item.getMaterialId());
        }
        if (material == null && StringUtils.hasText(item.getMaterialName()) && StringUtils.hasText(item.getSpecification())) {
            material = materialMapper.selectOne(new LambdaQueryWrapper<MaterialEntity>()
                    .eq(MaterialEntity::getName, item.getMaterialName())
                    .eq(MaterialEntity::getSpecification, item.getSpecification()));
        }
        if (material == null) {
            throw new ScmBusinessException("未找到对应物资字典数据，无法入库");
        }

        String batchNumber = item.getBatchNumber();
        if (!StringUtils.hasText(batchNumber)) {
            throw new ScmBusinessException("批号不能为空");
        }

        InventoryEntity inventory = inventoryMapper.selectOne(new LambdaQueryWrapper<InventoryEntity>()
                .eq(InventoryEntity::getMaterialCode, material.getMaterialCode())
                .eq(InventoryEntity::getBatchNumber, batchNumber)
                .eq(InventoryEntity::getWarehouse, toWarehouse));

        if (quantity <= 0) {
            return;
        }

        if (inventory == null) {
            inventory = new InventoryEntity();
            inventory.setMaterialId(material.getId());
            inventory.setMaterialCode(material.getMaterialCode());
            inventory.setMaterialName(material.getName());
            inventory.setCategory(material.getMaterialType());
            inventory.setSpecification(material.getSpecification());
            inventory.setModel(material.getModel());
            inventory.setWarehouse(toWarehouse);
            inventory.setShelf("默认货位");
            inventory.setBatchNumber(batchNumber);
            inventory.setProductionDate(toLocalDate(item.getProductionDate()));
            inventory.setExpiryDate(toLocalDate(item.getExpiryDate()));
            inventory.setMinPackage(material.getMinPackage());
            inventory.setUnit(material.getUnit());
            inventory.setPurchasePrice(material.getPurchasePrice());
            inventory.setCurrentStock(quantity);
            inventory.setMinStock(10);
            inventory.setMaxStock(1000);
            inventory.setExpiryWarningDays(90);
            inventory.setRegistrationNumber(material.getRegistrationNumber());
            inventory.setSupplier(material.getSupplierName());
            inventory.setManufacturer(material.getManufacturer());
            inventory.setLastInbound(LocalDate.now());
            inventory.setCreateTime(LocalDateTime.now());
            inventory.setUpdateTime(LocalDateTime.now());
            ScmInventorySupport.refreshStatus(inventory);
            inventoryMapper.insert(inventory);
        } else {
            inventory.setCurrentStock((inventory.getCurrentStock() == null ? 0 : inventory.getCurrentStock()) + quantity);
            inventory.setLastInbound(LocalDate.now());
            inventory.setUpdateTime(LocalDateTime.now());
            ScmInventorySupport.refreshStatus(inventory);
            inventoryMapper.updateById(inventory);
        }

        InventoryTransactionEntity transaction = new InventoryTransactionEntity();
        transaction.setInventoryId(inventory.getId());
        transaction.setMaterialId(inventory.getMaterialId());
        transaction.setMaterialCode(inventory.getMaterialCode());
        transaction.setMaterialName(inventory.getMaterialName());
        transaction.setBatchNumber(inventory.getBatchNumber());
        transaction.setOperationType("调拨入库");
        transaction.setQuantity(quantity);
        transaction.setBalanceQuantity(inventory.getCurrentStock());
        transaction.setReferenceNo(transferNumber);
        transaction.setOperatorName(operatorName);
        transaction.setRemark("调拨验收入库");
        transaction.setOperationTime(LocalDateTime.now());
        inventoryTransactionMapper.insert(transaction);
    }

    private LocalDate toLocalDate(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private Date toDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return java.sql.Date.valueOf(date);
    }
}
