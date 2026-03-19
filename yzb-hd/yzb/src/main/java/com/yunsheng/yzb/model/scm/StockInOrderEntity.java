package com.yunsheng.yzb.model.scm;

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

    /** 入库单主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 入库单号。 */
    private String stockInNumber;

    /** 收货单主键。 */
    private Long receiveId;

    /** 收货单号。 */
    private String receiveNumber;

    /** 采购单主键。 */
    private Long purchaseOrderId;

    /** 采购单号。 */
    private String orderNumber;

    /** 入库类型。 */
    private String stockInType;

    /** 入库科室。 */
    private String departmentName;

    /** 操作人。 */
    private String operatorName;

    /** 供应商名称。 */
    private String supplierName;

    /** 入库日期。 */
    private LocalDate stockInDate;

    /** 单据状态。 */
    private String status;

    /** 物资种类数。 */
    private Integer materialCount;

    /** 入库总金额。 */
    private BigDecimal totalAmount;

    /** 备注。 */
    private String remark;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}