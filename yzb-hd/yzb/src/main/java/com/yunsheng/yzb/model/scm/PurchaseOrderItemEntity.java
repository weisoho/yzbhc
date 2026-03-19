package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 采购单明细。
 */
@Data
@TableName("scm_purchase_order_item")
public class PurchaseOrderItemEntity {

    /** 明细主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 采购单主键。 */
    private Long purchaseOrderId;

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

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}