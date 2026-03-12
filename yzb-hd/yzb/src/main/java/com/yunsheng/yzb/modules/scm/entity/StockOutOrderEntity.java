package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 出库单主表。
 */
@Data
@TableName("scm_stock_out_order")
public class StockOutOrderEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String stockOutNumber;

    private String stockOutType;

    private String departmentName;

    private String operatorName;

    private String status;

    private String reason;

    private String remark;

    private LocalDate outboundDate;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}