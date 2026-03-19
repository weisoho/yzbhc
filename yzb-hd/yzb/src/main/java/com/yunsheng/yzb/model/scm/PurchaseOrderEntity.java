package com.yunsheng.yzb.model.scm;

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

    /** 采购单主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 采购单号。 */
    private String orderNumber;

    /** 采购科室主键。 */
    private Long departmentId;

    /** 采购科室名称。 */
    private String departmentName;

    /** 供应商主键。 */
    private Long supplierId;

    /** 供应商名称。 */
    private String supplierName;

    /** 操作人。 */
    private String operatorName;

    /** 计划类型。 */
    private String planType;

    /** 单据状态。 */
    private String status;

    /** 备注。 */
    private String remark;

    /** 驳回原因。 */
    private String rejectReason;

    /** 总金额。 */
    private BigDecimal totalAmount;

    /** 明细数量。 */
    private Integer itemCount;

    /** 提交时间。 */
    private LocalDateTime submitTime;

    /** 审核时间。 */
    private LocalDateTime auditTime;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}