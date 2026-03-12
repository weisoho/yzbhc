package com.yunsheng.yzb.modules.scm.dto;

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

    @Data
    public static class PurchaseOrderDetail {
        private Long id;
        private String orderNumber;
        private String departmentName;
        private String supplierName;
        private String operatorName;
        private String planType;
        private String status;
        private String remark;
        private String rejectReason;
        private BigDecimal totalAmount;
        private Integer itemCount;
        private LocalDateTime createTime;
        private List<PurchaseOrderItemDetail> items;
    }

    @Data
    public static class PurchaseOrderItemDetail {
        private Long id;
        private Long materialId;
        private String materialCode;
        private String materialName;
        private String specification;
        private String model;
        private String unit;
        private String manufacturer;
        private String supplierName;
        private String registrationNumber;
        private BigDecimal unitPrice;
        private Integer quantity;
        private Integer receivedQuantity;
        private Integer stockedQuantity;
        private BigDecimal amount;
        private String status;
    }

    @Data
    public static class PurchaseReceiveDetail {
        private Long id;
        private String receiveNumber;
        private String orderNumber;
        private String supplierName;
        private String supplierCode;
        private String departmentName;
        private String buyer;
        private String contactPerson;
        private String contactPhone;
        private LocalDate orderDate;
        private LocalDate expectedDeliveryDate;
        private LocalDate actualDeliveryDate;
        private String receiver;
        private String status;
        private Integer itemCount;
        private BigDecimal totalAmount;
        private String remark;
        private List<PurchaseReceiveItemDetail> items;
    }

    @Data
    public static class PurchaseReceiveItemDetail {
        private Long id;
        private String productCode;
        private String productName;
        private String specification;
        private String model;
        private String manufacturer;
        private String registrationNumber;
        private String unit;
        private BigDecimal price;
        private Integer quantity;
        private Integer actualReceivedQuantity;
        private BigDecimal amount;
        private String batchNumber;
        private LocalDate productionDate;
        private LocalDate expiryDate;
        private String status;
        private String shortageReason;
    }

    @Data
    public static class StockInDetail {
        private Long id;
        private String stockInNumber;
        private String orderNumber;
        private String stockInType;
        private String departmentName;
        private String operatorName;
        private String supplier;
        private LocalDate stockInDate;
        private String status;
        private Integer materialCount;
        private BigDecimal totalAmount;
        private String remark;
        private List<StockInItemDetail> items;
    }

    @Data
    public static class StockInItemDetail {
        private Long id;
        private String materialCode;
        private String materialName;
        private String materialType;
        private String specification;
        private String model;
        private String minPackage;
        private String unit;
        private BigDecimal purchasePrice;
        private Integer orderQuantity;
        private Integer stockInQuantity;
        private BigDecimal purchaseAmount;
        private String registrationNumber;
        private String supplier;
        private String manufacturer;
        private String batchNumber;
        private LocalDate productionDate;
        private LocalDate expiryDate;
        private String remark;
    }

    @Data
    public static class PendingStockInItem {
        private Long id;
        private Long receiveId;
        private Long receiveItemId;
        private String orderNumber;
        private String productCode;
        private String productName;
        private String specification;
        private String model;
        private String manufacturer;
        private String supplierName;
        private String registrationNumber;
        private Integer orderQuantity;
        private Integer receivedQuantity;
        private Integer pendingQuantity;
        private String orderUnit;
        private BigDecimal purchasePrice;
        private BigDecimal purchaseAmount;
        private String department;
        private String status;
    }

    @Data
    public static class InventoryBatchDetail {
        private String materialCode;
        private String batchNumber;
        private LocalDate productionDate;
        private LocalDate expiryDate;
        private LocalDate inboundDate;
        private Integer quantity;
        private String status;
    }

    @Data
    public static class InventoryDetail {
        private Long id;
        private String materialCode;
        private String materialName;
        private String category;
        private String specification;
        private String model;
        private String warehouse;
        private String shelf;
        private String batchNumber;
        private LocalDate productionDate;
        private LocalDate expiryDate;
        private String minPackage;
        private String unit;
        private BigDecimal purchasePrice;
        private Integer currentStock;
        private Integer minStock;
        private Integer maxStock;
        private String registrationNumber;
        private String supplier;
        private String manufacturer;
        private String stockStatus;
        private String warning;
        private Integer expiryWarningDays;
        private LocalDate lastInbound;
        private List<InventoryBatchDetail> batches;
    }
}