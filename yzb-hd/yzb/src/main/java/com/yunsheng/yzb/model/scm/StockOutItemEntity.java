package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 出库单明细。
 */
@Data
@TableName("scm_stock_out_item")
public class StockOutItemEntity {

    /** 明细主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 出库单主键。 */
    private Long stockOutOrderId;

    /** 库存主键。 */
    private Long inventoryId;

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

    /** 单位。 */
    private String unit;

    /** 供应商名称。 */
    private String supplier;

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

    /** 单价。 */
    private BigDecimal unitPrice;

    /** 出库数量。 */
    private Integer outboundQuantity;

    /** 出库日期。 */
    private LocalDate outboundDate;

    /** 领用科室。 */
    @com.baomidou.mybatisplus.annotation.TableField(exist = false)
    private String departmentName;

    /** 操作人。 */
    @com.baomidou.mybatisplus.annotation.TableField(exist = false)
    private String operatorName;

    /** 明细状态。 */
    private String status;

    /** 冲销状态。 */
    private String undoStatus;

    /** 出库原因。 */
    private String reason;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}