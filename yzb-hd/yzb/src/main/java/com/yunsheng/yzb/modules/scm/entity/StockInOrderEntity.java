package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 入库单主表。
 */
@Data
@TableName("scm_stock_in_order")
public class StockInOrderEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String stockInNumber;

    private Long receiveId;

    private String receiveNumber;

    private Long purchaseOrderId;

    private String orderNumber;

    private String stockInType;

    private String departmentName;

    private String operatorName;

    private String supplierName;

    private LocalDate stockInDate;

    private String status;

    private Integer materialCount;

    private BigDecimal totalAmount;

    private String remark;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}