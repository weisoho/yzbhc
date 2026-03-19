package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购收货单明细。
 */
@Data
@TableName("scm_purchase_receive_item")
public class PurchaseReceiveItemEntity {

    /** 明细主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 收货单主键。 */
    private Long receiveId;

    /** 采购单明细主键。 */
    private Long purchaseOrderItemId;

    /** 物资编码。 */
    private String productCode;

    /** 物资名称。 */
    private String productName;

    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;

    /** 生产厂家。 */
    private String manufacturer;

    /** 注册证号。 */
    private String registrationNumber;

    /** 单位。 */
    private String unit;

    /** 单价。 */
    private BigDecimal price;

    /** 订单数量。 */
    private Integer quantity;

    /** 实际到货数量。 */
    private Integer actualReceivedQuantity;

    /** 金额。 */
    private BigDecimal amount;

    /** 批号。 */
    private String batchNumber;

    /** 生产日期。 */
    private LocalDate productionDate;

    /** 有效期。 */
    private LocalDate expiryDate;

    /** 明细状态。 */
    private String status;

    /** 缺货原因。 */
    private String shortageReason;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}