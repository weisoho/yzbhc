package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 异常订单实体。
 */
@Data
@TableName("scm_exception_order")
public class ExceptionOrderEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    private Long purchaseOrderId;

    private String supplierName;

    private String supplierCode;

    private String department;

    private String buyer;

    private String contactPerson;

    private String contactPhone;

    private LocalDate orderDate;

    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    private String status;

    private String rejectReason;

    private String timeoutReason;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;

    private LocalDateTime resubmittedAt;
}