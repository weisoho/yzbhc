package com.yunsheng.yzb.vo.scm;

import lombok.Data;
import lombok.EqualsAndHashCode;

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

    /**
     * 供应商分页查询参数。
     */
    @Data
    public static class SupplierQuery extends PageQuery {
        /** 供应商名称。 */
        private String name;
        /** 联系人。 */
        private String contactPerson;
        /** 联系电话。 */
        private String contactPhone;
        /** 法定代表人。 */
        private String legalRepresentative;
        /** 企业类型。 */
        private String enterpriseType;
        /** 供应商状态。 */
        private String status;
    }

    /**
     * 供应商保存参数。
     */
    @Data
    public static class SupplierSave {
        /** 供应商名称。 */
        @NotBlank(message = "供应商名称不能为空")
        private String name;

        /** 企业类型。 */
        @NotBlank(message = "企业类型不能为空")
        private String enterpriseType;

        /** 联系人。 */
        @NotBlank(message = "联系人不能为空")
        private String contactPerson;

        /** 联系电话。 */
        @NotBlank(message = "联系电话不能为空")
        private String contactPhone;

        /** 联系地址。 */
        @NotBlank(message = "联系地址不能为空")
        private String address;

        /** 统一社会信用代码。 */
        private String creditCode;

        /** 税号。 */
        private String taxNumber;

        /** 法定代表人。 */
        private String legalRepresentative;

        /** 注册资本。 */
        private String registeredCapital;

        /** 注册日期。 */
        private LocalDate registrationDate;
    }

    /**
     * 供应商资质分页查询参数。
     */
    @Data
    public static class QualificationQuery extends PageQuery {
        /** 供应商主键。 */
        private Long supplierId;
        /** 资质类型。 */
        private String type;
        /** 资质名称/供应商名称。 */
        private String certificateName;
        /** 证件编号。 */
        private String licenseNumber;
        /** 统一社会信用代码。 */
        private String creditCode;
        /** 法定代表人。 */
        private String legalRepresentative;
        /** 预警状态。 */
        private String warningStatus;
        /** 预警天数。 */
        private Integer warningDays;
    }

    /**
     * 供应商资质保存参数。
     */
    @Data
    public static class QualificationSave {
        /** 资质类型。 */
        @NotBlank(message = "资质类型不能为空")
        private String type;

        /** 资质名称。 */
        @NotBlank(message = "资质名称不能为空")
        private String certificateName;

        /** 证件编号。 */
        @NotBlank(message = "证件编号不能为空")
        private String licenseNumber;

        /** 证件类别。 */
        @NotBlank(message = "证件类别不能为空")
        private String licenseType;

        /** 发证日期。 */
        @NotNull(message = "发证日期不能为空")
        private LocalDate issueDate;

        /** 有效期。 */
        @NotNull(message = "有效期不能为空")
        private LocalDate expiryDate;

        /** 发证机构。 */
        @NotBlank(message = "发证机构不能为空")
        private String issuingAuthority;

        /** 附件名称。 */
        private String attachmentName;

        /** 附件地址。 */
        private String licenseFile;
    }

    /**
     * 物资分页查询参数。
     */
    @EqualsAndHashCode(callSuper = true)
    @Data
    public static class MaterialQuery extends PageQuery {
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String name;
        /** 供应商名称。 */
        private String supplier;
        /** 生产厂家。 */
        private String manufacturer;
        /** 物资状态。 */
        private String status;
    }

    /**
     * 物资保存参数。
     */
    @Data
    public static class MaterialSave {
        /** 物资编码。 */
        private String materialCode;

        /** 物资名称。 */
        @NotBlank(message = "物资名称不能为空")
        private String name;

        /** 物资类型。 */
        @NotBlank(message = "物资类型不能为空")
        private String materialType;

        /** 规格。 */
        @NotBlank(message = "规格不能为空")
        private String specification;

        /** 型号。 */
        @NotBlank(message = "型号不能为空")
        private String model;

        /** 最小包装。 */
        @NotBlank(message = "最小包装不能为空")
        private String minPackage;

        /** 单位。 */
        @NotBlank(message = "单位不能为空")
        private String unit;

        /** 采购价格。 */
        @NotNull(message = "采购价格不能为空")
        private BigDecimal purchasePrice;

        /** 供应商主键。 */
        @NotNull(message = "供应商不能为空")
        private Long supplierId;

        /** 资质主键。 */
        @NotNull(message = "注册证不能为空")
        private Long qualificationId;

        /** 生产厂家。 */
        @NotBlank(message = "生产厂家不能为空")
        private String manufacturer;

        /** 存储条件。 */
        @NotBlank(message = "存储条件不能为空")
        private String storageCondition;

        /** 物资状态。 */
        private String status;
    }

    /**
     * 采购分页查询参数。
     */
    @Data
    public static class PurchaseQuery extends PageQuery {
        /** 采购单号。 */
        private String orderNumber;
        /** 供应商名称。 */
        private String supplierName;
        /** 采购部门。 */
        private String department;
        /** 物资编码。 */
        private String productCode;
        /** 物资名称。 */
        private String productName;
        /** 生产厂家。 */
        private String manufacturer;
        /** 单据状态。 */
        private String status;
    }

    @Data
    public static class ExceptionOrderUpdate {
        private String supplierName;
        private String supplierCode;
        private String department;
        private String buyer;
        private String contactPerson;
        private String contactPhone;
        private LocalDate orderDate;
        private LocalDate expectedDeliveryDate;
        private BigDecimal totalAmount;
        private String rejectReason;
        private String timeoutReason;
    }

    /**
     * 采购单保存参数。
     */
    @Data
    public static class PurchaseSave {
        /** 采购科室主键。 */
        @NotNull(message = "采购科室不能为空")
        private Long departmentId;

        /** 采购科室名称。 */
        @NotBlank(message = "采购科室名称不能为空")
        private String departmentName;

        /** 供应商主键。 */
        @NotNull(message = "供应商不能为空")
        private Long supplierId;

        /** 操作人姓名。 */
        @NotBlank(message = "操作人不能为空")
        private String operatorName;

        /** 计划类型。 */
        @NotBlank(message = "计划类型不能为空")
        private String planType;

        /** 备注。 */
        private String remark;

        /** 采购明细列表。 */
        @Valid
        @NotEmpty(message = "采购明细不能为空")
        private List<PurchaseItemSave> items;
    }

    /**
     * 采购单明细保存参数。
     */
    @Data
    public static class PurchaseItemSave {
        /** 物资主键。 */
        @NotNull(message = "物资不能为空")
        private Long materialId;

        /** 采购数量。 */
        @NotNull(message = "采购数量不能为空")
        @Min(value = 1, message = "采购数量必须大于 0")
        private Integer quantity;
    }

    /**
     * 采购审核参数。
     */
    @Data
    public static class PurchaseAudit {
        /** 审核人姓名。 */
        @NotBlank(message = "审核人不能为空")
        private String operatorName;

        /** 审核意见或驳回原因。 */
        private String reason;
    }

    /**
     * 收货保存参数。
     */
    @Data
    public static class PurchaseReceiveSave {
        /** 收货人。 */
        @NotBlank(message = "收货人不能为空")
        private String receiver;

        /** 联系人。 */
        @NotBlank(message = "联系人不能为空")
        private String contactPerson;

        /** 联系电话。 */
        @NotBlank(message = "联系电话不能为空")
        private String contactPhone;

        /** 实际到货日期。 */
        @NotNull(message = "实际到货日期不能为空")
        private LocalDate actualDeliveryDate;

        /** 收货备注。 */
        private String remark;

        /** 收货明细列表。 */
        @Valid
        @NotEmpty(message = "收货明细不能为空")
        private List<PurchaseReceiveItemSave> items;
    }

    /**
     * 收货明细保存参数。
     */
    @Data
    public static class PurchaseReceiveItemSave {
        /** 采购单明细主键。 */
        @NotNull(message = "采购明细不能为空")
        private Long purchaseOrderItemId;

        /** 实际到货数量。 */
        @NotNull(message = "实际到货数量不能为空")
        @Min(value = 0, message = "实际到货数量不能小于 0")
        private Integer actualReceivedQuantity;

        /** 缺货原因。 */
        private String shortageReason;
    }

    /**
     * 入库分页查询参数。
     */
    @Data
    public static class StockInQuery extends PageQuery {
        /** 入库单号。 */
        private String stockInNumber;
        /** 采购单号。 */
        private String orderNumber;
        /** 供应商。 */
        private String supplier;
        /** 物资编码。 */
        private String productCode;
        /** 物资名称。 */
        private String productName;
        /** 生产厂家。 */
        private String manufacturer;
        /** 入库状态。 */
        private String status;
    }

    /**
     * 入库保存参数。
     */
    @Data
    public static class StockInSave {
        /** 入库类型。 */
        @NotBlank(message = "入库类型不能为空")
        private String stockInType;

        /** 入库人。 */
        @NotBlank(message = "入库人不能为空")
        private String operatorName;

        /** 入库备注。 */
        private String remark;

        /** 入库明细列表。 */
        @Valid
        @NotEmpty(message = "入库明细不能为空")
        private List<StockInItemSave> items;
    }

    /**
     * 入库明细保存参数。
     */
    @Data
    public static class StockInItemSave {
        /** 收货明细主键。 */
        private Long receiveItemId;

        /** 物资主键。 */
        private Long materialId;

        /** 物资编码。 */
        @NotBlank(message = "物资编码不能为空")
        private String materialCode;

        /** 物资名称。 */
        @NotBlank(message = "物资名称不能为空")
        private String materialName;

        /** 物资类型。 */
        private String materialType;

        /** 规格。 */
        @NotBlank(message = "规格不能为空")
        private String specification;

        /** 型号。 */
        @NotBlank(message = "型号不能为空")
        private String model;

        /** 最小包装。 */
        @NotBlank(message = "最小包装不能为空")
        private String minPackage;

        /** 单位。 */
        @NotBlank(message = "单位不能为空")
        private String unit;

        /** 供应商名称。 */
        @NotBlank(message = "供应商不能为空")
        private String supplierName;

        /** 生产厂家。 */
        @NotBlank(message = "生产厂家不能为空")
        private String manufacturer;

        /** 注册证号。 */
        @NotBlank(message = "注册证号不能为空")
        private String registrationNumber;

        /** 批号。 */
        @NotBlank(message = "批号不能为空")
        private String batchNumber;

        /** 生产日期。 */
        @NotNull(message = "生产日期不能为空")
        private LocalDate productionDate;

        /** 有效期。 */
        @NotNull(message = "有效期不能为空")
        private LocalDate expiryDate;

        /** 采购价。 */
        @NotNull(message = "采购价不能为空")
        private BigDecimal purchasePrice;

        /** 订单数量。 */
        @NotNull(message = "订单数量不能为空")
        @Min(value = 1, message = "订单数量必须大于 0")
        private Integer orderQuantity;

        /** 入库数量。 */
        @NotNull(message = "入库数量不能为空")
        @Min(value = 1, message = "入库数量必须大于 0")
        private Integer stockInQuantity;

        /** 入库备注。 */
        private String remark;
    }

    /**
     * 库存分页查询参数。
     */
    @Data
    public static class InventoryQuery extends PageQuery {
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String materialName;
        /** 供应商名称。 */
        private String supplier;
        /** 生产厂家。 */
        private String manufacturer;
        /** 仓库或科室名称。 */
        private String warehouse;
        /** 批号。 */
        private String batchNumber;
        /** 库存状态。 */
        private String stockStatus;
    }

    /**
     * 库存阈值调整参数。
     */
    @Data
    public static class InventoryAdjustSave {
        /** 最低库存。 */
        @NotNull(message = "最低库存不能为空")
        @Min(value = 0, message = "最低库存不能小于 0")
        private Integer minStock;

        /** 最高库存。 */
        @NotNull(message = "最高库存不能为空")
        @Min(value = 0, message = "最高库存不能小于 0")
        private Integer maxStock;

        /** 效期预警天数。 */
        @NotNull(message = "效期预警天数不能为空")
        @Min(value = 1, message = "效期预警天数必须大于 0")
        private Integer expiryWarningDays;

        /** 调整原因。 */
        @NotBlank(message = "调整原因不能为空")
        private String reason;
    }

    /**
     * 出库撤销分页查询参数。
     */
    @Data
    public static class StockOutQuery extends PageQuery {
        /** 物资编码。 */
        private String materialCode;
        /** 物资名称。 */
        private String materialName;
        /** 供应商名称。 */
        private String supplier;
        /** 生产厂家。 */
        private String manufacturer;
        /** 撤销状态。 */
        private String undoStatus;
        /** 领用科室。 */
        private String departmentName;
        /** 开始日期。 */
        private String startDate;
        /** 结束日期。 */
        private String endDate;
    }

    /**
     * 出库保存参数。
     */
    @Data
    public static class StockOutSave {
        /** 出库类型。 */
        @NotBlank(message = "出库类型不能为空")
        private String stockOutType;

        /** 出库科室名称。 */
        @NotBlank(message = "出库科室不能为空")
        private String departmentName;

        /** 操作人。 */
        @NotBlank(message = "操作人不能为空")
        private String operatorName;

        /** 出库原因。 */
        @NotBlank(message = "出库原因不能为空")
        private String reason;

        /** 出库备注。 */
        private String remark;

        /** 出库日期。 */
        @NotNull(message = "出库日期不能为空")
        private LocalDate outboundDate;

        /** 出库明细列表。 */
        @Valid
        @NotEmpty(message = "出库明细不能为空")
        private List<StockOutItemSave> items;
    }

    /**
     * 出库明细保存参数。
     */
    @Data
    public static class StockOutItemSave {
        /** 库存主键。 */
        @NotNull(message = "库存不能为空")
        private Long inventoryId;

        /** 出库数量。 */
        @NotNull(message = "出库数量不能为空")
        @Min(value = 1, message = "出库数量必须大于 0")
        private Integer outboundQuantity;
    }

    /**
     * 撤销出库参数。
     */
    @Data
    public static class UndoSave {
        /** 撤销人。 */
        @NotBlank(message = "撤销人不能为空")
        private String operatorName;

        /** 撤销原因。 */
        @NotBlank(message = "撤销原因不能为空")
        private String reason;
    }

    /**
     * 操作日志分页查询参数。
     */
    @Data
    public static class OperationLogQuery extends PageQuery {
        /** 模糊搜索文本。 */
        private String searchText;
        /** 操作类型。 */
        private String operationType;
        /** 操作状态。 */
        private String status;
        /** 开始日期。 */
        private LocalDate startDate;
        /** 结束日期。 */
        private LocalDate endDate;
    }
}
