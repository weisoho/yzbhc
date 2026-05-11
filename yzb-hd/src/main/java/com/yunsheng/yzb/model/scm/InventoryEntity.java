package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 实时库存实体。
 */
@Data
@TableName("scm_inventory")
public class InventoryEntity {

    /** 库存主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 物资主键。 */
    private Long materialId;

    /** 物资编码。 */
    private String materialCode;

    /** 物资名称。 */
    private String materialName;

    /** 物资类别。 */
    private String category;

    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;

    /** 仓库。 */
    private String warehouse;

    /** 货架。 */
    private String shelf;

    /** 批号。 */
    private String batchNumber;

    /** 物资唯一码。 */
    private String uniqueCode;

    /** 生产日期。 */
    private LocalDate productionDate;

    /** 有效期。 */
    private LocalDate expiryDate;

    /** 最小包装。 */
    private String minPackage;

    /** 单位。 */
    private String unit;

    /** 采购单价。 */
    private BigDecimal purchasePrice;

    /** 当前库存。 */
    private Integer currentStock;

    /** 最低库存。 */
    private Integer minStock;

    /** 最高库存。 */
    private Integer maxStock;

    /** 效期预警天数。 */
    private Integer expiryWarningDays;

    /** 注册证号。 */
    private String registrationNumber;

    /** 供应商名称。 */
    private String supplier;

    /** 生产厂家。 */
    private String manufacturer;

    /** 库存状态。 */
    private String stockStatus;

    /** 预警信息。 */
    private String warning;

    /** 最近入库日期。 */
    private LocalDate lastInbound;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}