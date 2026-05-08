package com.yunsheng.yzb.vo.scm;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 供应链模块返回对象定义。
 */
public final class ScmView {

    private ScmView() {
    }

    /**
     * 采购单详情视图。
     */
    @Data
    public static class PurchaseOrderDetail {
        /** 采购单主键。 */
        private Long id;
        /** 采购单号。 */
        private String orderNumber;
        /** 科室名称。 */
        private String departmentName;
        /** 供应商名称。 */
        private String supplierName;
        /** 操作人。 */
        private String operatorName;
        /** 计划类型。 */
        private String planType;
        /** 单据状态。 */
        private String status;
        /** 备注。 */
        private String remark;
        /** 驳回原因。 */
        private String rejectReason;
        /** 总金额。 */
        private BigDecimal totalAmount;
        /** 明细数量。 */
        private Integer itemCount;
        /** 创建时间。 */
        private LocalDateTime createTime;
        /** 采购明细列表。 */
        private List<PurchaseOrderItemDetail> items;
    }

    /**
     * 采购单明细视图。
     */
    @Data
    public static class PurchaseOrderItemDetail {
        /** 明细主键。 */
        private Long id;
        /** 物资主键。 */
        private Long materialId;
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String materialName;
        /** 规格。 */
        private String specification;
        /** 型号。 */
        private String model;
        /** 单位。 */
        private String unit;
        /** 生产厂家。 */
        private String manufacturer;
        /** 供应商名称。 */
        private String supplierName;
        /** 注册证号。 */
        private String registrationNumber;
        /** 单价。 */
        private BigDecimal unitPrice;
        /** 采购数量。 */
        private Integer quantity;
        /** 已收货数量。 */
        private Integer receivedQuantity;
        /** 已入库数量。 */
        private Integer stockedQuantity;
        /** 金额。 */
        private BigDecimal amount;
        /** 明细状态。 */
        private String status;
    }

    /**
     * 收货单详情视图。
     */
    @Data
    public static class PurchaseReceiveDetail {
        /** 收货单主键。 */
        private Long id;
        /** 收货单号。 */
        private String receiveNumber;
        /** 采购单号。 */
        private String orderNumber;
        /** 供应商名称。 */
        private String supplierName;
        /** 供应商编码。 */
        private String supplierCode;
        /** 科室名称。 */
        private String departmentName;
        /** 采购人。 */
        private String buyer;
        /** 联系人。 */
        private String contactPerson;
        /** 联系电话。 */
        private String contactPhone;
        /** 下单日期。 */
        private LocalDate orderDate;
        /** 预计到货日期。 */
        private LocalDate expectedDeliveryDate;
        /** 实际到货日期。 */
        private LocalDate actualDeliveryDate;
        /** 收货人。 */
        private String receiver;
        /** 收货状态。 */
        private String status;
        /** 明细数量。 */
        private Integer itemCount;
        /** 总金额。 */
        private BigDecimal totalAmount;
        /** 收货备注。 */
        private String remark;
        /** 收货明细列表。 */
        private List<PurchaseReceiveItemDetail> items;
    }

    /**
     * 收货单明细视图。
     */
    @Data
    public static class PurchaseReceiveItemDetail {
        /** 明细主键。 */
        private Long id;
        /** 物资编码。 */
        private String productCode;
        /** 物资名称。 */
        private String productName;
        /** 规格。 */
        private String specification;
        /** 型号。 */
        private String model;
        /** 生产厂家。 */
        private String manufacturer;
        /** 注册证号。 */
        private String registrationNumber;
        /** 单位。 */
        private String unit;
        /** 单价。 */
        private BigDecimal price;
        /** 订单数量。 */
        private Integer quantity;
        /** 实际到货数量。 */
        private Integer actualReceivedQuantity;
        /** 金额。 */
        private BigDecimal amount;
        /** 批号。 */
        private String batchNumber;
        /** 生产日期。 */
        private LocalDate productionDate;
        /** 有效期。 */
        private LocalDate expiryDate;
        /** 明细状态。 */
        private String status;
        /** 缺货原因。 */
        private String shortageReason;
    }

    /**
     * 入库单详情视图。
     */
    @Data
    public static class StockInDetail {
        /** 入库单主键。 */
        private Long id;
        /** 入库单号。 */
        private String stockInNumber;
        /** 采购单号。 */
        private String orderNumber;
        /** 入库类型。 */
        private String stockInType;
        /** 科室名称。 */
        private String departmentName;
        /** 操作人。 */
        private String operatorName;
        /** 供应商名称。 */
        private String supplier;
        /** 入库日期。 */
        private LocalDate stockInDate;
        /** 单据状态。 */
        private String status;
        /** 物资种类数。 */
        private Integer materialCount;
        /** 总金额。 */
        private BigDecimal totalAmount;
        /** 入库备注。 */
        private String remark;
        /** 入库明细列表。 */
        private List<StockInItemDetail> items;
    }

    /**
     * 入库单明细视图。
     */
    @Data
    public static class StockInItemDetail {
        /** 明细主键。 */
        private Long id;
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String materialName;
        /** 物资类型。 */
        private String materialType;
        /** 规格。 */
        private String specification;
        /** 型号。 */
        private String model;
        /** 最小包装。 */
        private String minPackage;
        /** 单位。 */
        private String unit;
        /** 采购价。 */
        private BigDecimal purchasePrice;
        /** 订单数量。 */
        private Integer orderQuantity;
        /** 入库数量。 */
        private Integer stockInQuantity;
        /** 采购金额。 */
        private BigDecimal purchaseAmount;
        /** 注册证号。 */
        private String registrationNumber;
        /** 供应商名称。 */
        private String supplier;
        /** 生产厂家。 */
        private String manufacturer;
        /** 批号。 */
        private String batchNumber;
        /** 生产日期。 */
        private LocalDate productionDate;
        /** 有效期。 */
        private LocalDate expiryDate;
        /** 备注。 */
        private String remark;
    }

    /**
     * 待入库明细视图。
     */
    @Data
    public static class PendingStockInItem {
        /** 收货明细主键。 */
        private Long id;
        /** 收货单主键。 */
        private Long receiveId;
        /** 收货单号。 */
        private String receiveNumber;
        /** 收货单明细主键。 */
        private Long receiveItemId;
        /** 采购单号。 */
        private String orderNumber;
        /** 物资编码。 */
        private String productCode;
        /** 物资名称。 */
        private String productName;
        /** 规格。 */
        private String specification;
        /** 型号。 */
        private String model;
        /** 生产厂家。 */
        private String manufacturer;
        /** 供应商名称。 */
        private String supplierName;
        /** 注册证号。 */
        private String registrationNumber;
        /** 订单数量。 */
        private Integer orderQuantity;
        /** 已收货数量。 */
        private Integer receivedQuantity;
        /** 待入库数量。 */
        private Integer pendingQuantity;
        /** 订单单位。 */
        private String orderUnit;
        /** 采购价。 */
        private BigDecimal purchasePrice;
        /** 采购金额。 */
        private BigDecimal purchaseAmount;
        /** 科室名称。 */
        private String department;
        /** 当前状态。 */
        private String status;
    }

    /**
     * 库存批次视图。
     */
    @Data
    public static class InventoryBatchDetail {
        /** 物资编码。 */
        private String materialCode;
        /** 批号。 */
        private String batchNumber;
        /** 生产日期。 */
        private LocalDate productionDate;
        /** 有效期。 */
        private LocalDate expiryDate;
        /** 入库日期。 */
        private LocalDate inboundDate;
        /** 批次数量。 */
        private Integer quantity;
        /** 批次状态。 */
        private String status;
    }

    /**
     * 库存详情视图。
     */
    @Data
    public static class InventoryDetail {
        /** 库存主键。 */
        private Long id;
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String materialName;
        /** 物资分类。 */
        private String category;
        /** 规格。 */
        private String specification;
        /** 型号。 */
        private String model;
        /** 仓库或科室名称。 */
        private String warehouse;
        /** 货位。 */
        private String shelf;
        /** 批号。 */
        private String batchNumber;
        /** 生产日期。 */
        private LocalDate productionDate;
        /** 有效期。 */
        private LocalDate expiryDate;
        /** 最小包装。 */
        private String minPackage;
        /** 单位。 */
        private String unit;
        /** 采购价。 */
        private BigDecimal purchasePrice;
        /** 当前库存。 */
        private Integer currentStock;
        /** 最低库存。 */
        private Integer minStock;
        /** 最高库存。 */
        private Integer maxStock;
        /** 注册证号。 */
        private String registrationNumber;
        /** 供应商名称。 */
        private String supplier;
        /** 生产厂家。 */
        private String manufacturer;
        /** 库存状态。 */
        private String stockStatus;
        /** 预警标识。 */
        private String warning;
        /** 效期预警天数。 */
        private Integer expiryWarningDays;
        /** 最近入库日期。 */
        private LocalDate lastInbound;
        /** 批次列表。 */
        private List<InventoryBatchDetail> batches;
    }
}