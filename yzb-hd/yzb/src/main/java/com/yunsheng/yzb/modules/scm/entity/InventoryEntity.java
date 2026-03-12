package com.yunsheng.yzb.modules.scm.entity;

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

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long materialId;

    private String materialCode;

    private String materialName;

    private String category;

    private String specification;

    private String model;

    private String warehouse;

    private String shelf;

    private String batchNumber;

    private LocalDate productionDate;

    private LocalDate expiryDate;

    private String minPackage;

    private String unit;

    private BigDecimal purchasePrice;

    private Integer currentStock;

    private Integer minStock;

    private Integer maxStock;

    private Integer expiryWarningDays;

    private String registrationNumber;

    private String supplier;

    private String manufacturer;

    private String stockStatus;

    private String warning;

    private LocalDate lastInbound;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}