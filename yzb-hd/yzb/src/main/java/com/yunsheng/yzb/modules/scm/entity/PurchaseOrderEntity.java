package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 采购单主表。
 */
@Data
@TableName("scm_purchase_order")
public class PurchaseOrderEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNumber;

    private Long departmentId;

    private String departmentName;

    private Long supplierId;

    private String supplierName;

    private String operatorName;

    private String planType;

    private String status;

    private String remark;

    private String rejectReason;

    private BigDecimal totalAmount;

    private Integer itemCount;

    private LocalDateTime submitTime;

    private LocalDateTime auditTime;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}