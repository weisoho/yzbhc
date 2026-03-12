package com.yunsheng.yzb.modules.scm.entity;

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

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long purchaseOrderId;

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

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}