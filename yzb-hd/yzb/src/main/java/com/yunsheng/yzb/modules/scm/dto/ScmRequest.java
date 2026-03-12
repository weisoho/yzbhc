package com.yunsheng.yzb.modules.scm.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 供应链模块请求对象定义。
 */
public final class ScmRequest {

    private ScmRequest() {
    }

    @Data
    public static class SupplierQuery extends PageQuery {
        private String name;
        private String contactPerson;
        private String contactPhone;
        private String enterpriseType;
        private String status;
    }

    @Data
    public static class SupplierSave {
        @NotBlank(message = "供应商名称不能为空")
        private String name;

        @NotBlank(message = "企业类型不能为空")
        private String enterpriseType;

        @NotBlank(message = "联系人不能为空")
        private String contactPerson;

        @NotBlank(message = "联系电话不能为空")
        private String contactPhone;

        @NotBlank(message = "联系地址不能为空")
        private String address;

        private String creditCode;

        private String taxNumber;

        private String legalRepresentative;

        private String registeredCapital;

        private LocalDate registrationDate;
    }

    @Data
    public static class QualificationSave {
        @NotBlank(message = "资质类型不能为空")
        private String type;

        @NotBlank(message = "资质名称不能为空")
        private String certificateName;

        @NotBlank(message = "证件编号不能为空")
        private String licenseNumber;

        @NotBlank(message = "证件类别不能为空")
        private String licenseType;

        @NotNull(message = "发证日期不能为空")
        private LocalDate issueDate;

        @NotNull(message = "有效期不能为空")
        private LocalDate expiryDate;

        @NotBlank(message = "发证机构不能为空")
        private String issuingAuthority;

        private String attachmentName;

        private String licenseFile;
    }

    @Data
    public static class MaterialQuery extends PageQuery {
        private String materialCode;
        private String name;
        private String supplier;
        private String manufacturer;
        private String status;
    }

    @Data
    public static class MaterialSave {
        private String materialCode;

        @NotBlank(message = "物资名称不能为空")
        private String name;

        @NotBlank(message = "物资类型不能为空")
        private String materialType;

        @NotBlank(message = "规格不能为空")
        private String specification;

        @NotBlank(message = "型号不能为空")
        private String model;

        @NotBlank(message = "最小包装不能为空")
        private String minPackage;

        @NotBlank(message = "单位不能为空")
        private String unit;

        @NotNull(message = "采购价格不能为空")
        private BigDecimal purchasePrice;

        @NotNull(message = "供应商不能为空")
        private Long supplierId;

        @NotNull(message = "注册证不能为空")
        private Long qualificationId;

        @NotBlank(message = "生产厂家不能为空")
        private String manufacturer;

        @NotBlank(message = "存储条件不能为空")
        private String storageCondition;

        private String status;
    }

    @Data
    public static class PurchaseQuery extends PageQuery {
        private String orderNumber;
        private String supplierName;
        private String productCode;
        private String productName;
        private String manufacturer;
        private String status;
    }

    @Data
    public static class PurchaseSave {
        @NotNull(message = "采购科室不能为空")
        private Long departmentId;

        @NotBlank(message = "采购科室名称不能为空")
        private String departmentName;

        @NotNull(message = "供应商不能为空")
        private Long supplierId;

        @NotBlank(message = "操作人不能为空")
        private String operatorName;

        @NotBlank(message = "计划类型不能为空")
        private String planType;

        private String remark;

        @Valid
        @NotEmpty(message = "采购明细不能为空")
        private List<PurchaseItemSave> items;
    }

    @Data
    public static class PurchaseItemSave {
        @NotNull(message = "物资不能为空")
        private Long materialId;

        @NotNull(message = "采购数量不能为空")
        @Min(value = 1, message = "采购数量必须大于 0")
        private Integer quantity;
    }

    @Data
    public static class PurchaseAudit {
        @NotBlank(message = "审核人不能为空")
        private String operatorName;

        private String reason;
    }

    @Data
    public static class PurchaseReceiveSave {
        @NotBlank(message = "收货人不能为空")
        private String receiver;

        @NotBlank(message = "联系人不能为空")
        private String contactPerson;

        @NotBlank(message = "联系电话不能为空")
        private String contactPhone;

        @NotNull(message = "实际到货日期不能为空")
        private LocalDate actualDeliveryDate;

        private String remark;

        @Valid
        @NotEmpty(message = "收货明细不能为空")
        private List<PurchaseReceiveItemSave> items;
    }

    @Data
    public static class PurchaseReceiveItemSave {
        @NotNull(message = "采购明细不能为空")
        private Long purchaseOrderItemId;

        @NotNull(message = "实际到货数量不能为空")
        @Min(value = 0, message = "实际到货数量不能小于 0")
        private Integer actualReceivedQuantity;

        private String shortageReason;
    }

    @Data
    public static class StockInQuery extends PageQuery {
        private String stockInNumber;
        private String orderNumber;
        private String productCode;
        private String productName;
        private String supplier;
        private String manufacturer;
        private String status;
    }

    @Data
    public static class StockInSave {
        @NotBlank(message = "入库类型不能为空")
        private String stockInType;

        @NotBlank(message = "入库人不能为空")
        private String operatorName;

        private String remark;

        @Valid
        @NotEmpty(message = "入库明细不能为空")
        private List<StockInItemSave> items;
    }

    @Data
    public static class StockInItemSave {
        private Long receiveItemId;

        private Long materialId;

        @NotBlank(message = "物资编码不能为空")
        private String materialCode;

        @NotBlank(message = "物资名称不能为空")
        private String materialName;

        @NotBlank(message = "规格不能为空")
        private String specification;

        @NotBlank(message = "型号不能为空")
        private String model;

        @NotBlank(message = "最小包装不能为空")
        private String minPackage;

        @NotBlank(message = "单位不能为空")
        private String unit;

        @NotBlank(message = "供应商不能为空")
        private String supplierName;

        @NotBlank(message = "生产厂家不能为空")
        private String manufacturer;

        @NotBlank(message = "注册证号不能为空")
        private String registrationNumber;

        @NotBlank(message = "批号不能为空")
        private String batchNumber;

        @NotNull(message = "生产日期不能为空")
        private LocalDate productionDate;

        @NotNull(message = "有效期不能为空")
        private LocalDate expiryDate;

        @NotNull(message = "采购价不能为空")
        private BigDecimal purchasePrice;

        @NotNull(message = "订单数量不能为空")
        @Min(value = 1, message = "订单数量必须大于 0")
        private Integer orderQuantity;

        @NotNull(message = "入库数量不能为空")
        @Min(value = 1, message = "入库数量必须大于 0")
        private Integer stockInQuantity;

        private String remark;
    }

    @Data
    public static class InventoryQuery extends PageQuery {
        private String materialCode;
        private String materialName;
        private String supplier;
        private String manufacturer;
        private String warehouse;
        private String batchNumber;
        private String stockStatus;
    }

    @Data
    public static class InventoryAdjustSave {
        @NotNull(message = "最低库存不能为空")
        @Min(value = 0, message = "最低库存不能小于 0")
        private Integer minStock;

        @NotNull(message = "最高库存不能为空")
        @Min(value = 0, message = "最高库存不能小于 0")
        private Integer maxStock;

        @NotNull(message = "效期预警天数不能为空")
        @Min(value = 1, message = "效期预警天数必须大于 0")
        private Integer expiryWarningDays;

        @NotBlank(message = "调整原因不能为空")
        private String reason;
    }

    @Data
    public static class StockOutQuery extends PageQuery {
        private String materialCode;
        private String materialName;
        private String supplier;
        private String manufacturer;
        private String undoStatus;
    }

    @Data
    public static class StockOutSave {
        @NotBlank(message = "出库类型不能为空")
        private String stockOutType;

        @NotBlank(message = "出库科室不能为空")
        private String departmentName;

        @NotBlank(message = "操作人不能为空")
        private String operatorName;

        @NotBlank(message = "出库原因不能为空")
        private String reason;

        private String remark;

        @NotNull(message = "出库日期不能为空")
        private LocalDate outboundDate;

        @Valid
        @NotEmpty(message = "出库明细不能为空")
        private List<StockOutItemSave> items;
    }

    @Data
    public static class StockOutItemSave {
        @NotNull(message = "库存不能为空")
        private Long inventoryId;

        @NotNull(message = "出库数量不能为空")
        @Min(value = 1, message = "出库数量必须大于 0")
        private Integer outboundQuantity;
    }

    @Data
    public static class UndoSave {
        @NotBlank(message = "撤销人不能为空")
        private String operatorName;

        @NotBlank(message = "撤销原因不能为空")
        private String reason;
    }

    @Data
    public static class OperationLogQuery extends PageQuery {
        private String searchText;
        private String operationType;
        private String status;
        private LocalDate startDate;
        private LocalDate endDate;
    }
}