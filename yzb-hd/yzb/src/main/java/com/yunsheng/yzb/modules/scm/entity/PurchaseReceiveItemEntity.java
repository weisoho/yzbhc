package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购收货单明细。
 */
@Data
@TableName("scm_purchase_receive_item")
public class PurchaseReceiveItemEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long receiveId;

    private Long purchaseOrderItemId;

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

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}