package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购收货单主表。
 */
@Data
@TableName("scm_purchase_receive")
public class PurchaseReceiveEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String receiveNumber;

    private Long purchaseOrderId;

    private String orderNumber;

    private Long supplierId;

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

    private BigDecimal totalAmount;

    private Integer itemCount;

    private String remark;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}