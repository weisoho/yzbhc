package com.yunsheng.yzb.model.scm;

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

    /** 异常订单主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 原采购单号。 */
    private String orderNo;

    /** 采购单主键。 */
    private Long purchaseOrderId;

    /** 供应商名称。 */
    private String supplierName;

    /** 供应商编码。 */
    private String supplierCode;

    /** 科室名称。 */
    private String department;

    /** 采购人。 */
    private String buyer;

    /** 联系人。 */
    private String contactPerson;

    /** 联系电话。 */
    private String contactPhone;

    /** 下单日期。 */
    private LocalDate orderDate;

    /** 预计到货日期。 */
    private LocalDate expectedDeliveryDate;

    /** 实际到货日期。 */
    private LocalDate actualDeliveryDate;

    /** 异常状态。 */
    private String status;

    /** 拒收原因。 */
    private String rejectReason;

    /** 超时原因。 */
    private String timeoutReason;

    /** 异常金额。 */
    private BigDecimal totalAmount;

    /** 创建时间。 */
    private LocalDateTime createdAt;

    /** 重新提交时间。 */
    private LocalDateTime resubmittedAt;
}