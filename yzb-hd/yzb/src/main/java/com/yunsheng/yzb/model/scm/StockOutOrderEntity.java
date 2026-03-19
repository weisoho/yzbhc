package com.yunsheng.yzb.model.scm;

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

    /** 出库单主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 出库单号。 */
    private String stockOutNumber;

    /** 出库类型。 */
    private String stockOutType;

    /** 领用科室。 */
    private String departmentName;

    /** 操作人。 */
    private String operatorName;

    /** 单据状态。 */
    private String status;

    /** 出库原因。 */
    private String reason;

    /** 备注。 */
    private String remark;

    /** 出库日期。 */
    private LocalDate outboundDate;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}