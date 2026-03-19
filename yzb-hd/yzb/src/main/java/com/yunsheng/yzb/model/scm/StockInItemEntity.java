package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 入库单明细。
 */
@Data
@TableName("scm_stock_in_item")
public class StockInItemEntity {

    /** 明细主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 入库单主键。 */
    private Long stockInOrderId;

    /** 收货明细主键。 */
    private Long receiveItemId;

    /** 物资主键。 */
    private Long materialId;

    /** 物资编码。 */
    private String materialCode;

    /** 物资名称。 */
    private String materialName;

    /** 物资类别。 */
    private String materialType;

    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;

    /** 最小包装。 */
    private String minPackage;

    /** 单位。 */
    private String unit;

    /** 采购单价。 */
    private BigDecimal purchasePrice;

    /** 订单数量。 */
    private Integer orderQuantity;

    /** 入库数量。 */
    private Integer stockInQuantity;

    /** 采购金额。 */
    private BigDecimal purchaseAmount;

    /** 供应商名称。 */
    private String supplierName;

    /** 生产厂家。 */
    private String manufacturer;

    /** 注册证号。 */
    private String registrationNumber;

    /** 批号。 */
    private String batchNumber;

    /** 生产日期。 */
    private LocalDate productionDate;

    /** 有效期。 */
    private LocalDate expiryDate;

    /** 明细状态。 */
    private String status;

    /** 备注。 */
    private String remark;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}