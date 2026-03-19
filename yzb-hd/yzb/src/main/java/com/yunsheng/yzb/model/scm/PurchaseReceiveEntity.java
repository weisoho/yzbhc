package com.yunsheng.yzb.model.scm;

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

    /** 收货单主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 收货单号。 */
    private String receiveNumber;

    /** 采购单主键。 */
    private Long purchaseOrderId;

    /** 采购单号。 */
    private String orderNumber;

    /** 供应商主键。 */
    private Long supplierId;

    /** 供应商名称。 */
    private String supplierName;

    /** 供应商编码。 */
    private String supplierCode;

    /** 科室名称。 */
    private String departmentName;

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

    /** 收货人。 */
    private String receiver;

    /** 收货状态。 */
    private String status;

    /** 总金额。 */
    private BigDecimal totalAmount;

    /** 明细数量。 */
    private Integer itemCount;

    /** 备注。 */
    private String remark;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}