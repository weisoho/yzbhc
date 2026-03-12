package com.yunsheng.yzb.modules.scm.entity;

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

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long stockInOrderId;

    private Long receiveItemId;

    private Long materialId;

    private String materialCode;

    private String materialName;

    private String materialType;

    private String specification;

    private String model;

    private String minPackage;

    private String unit;

    private BigDecimal purchasePrice;

    private Integer orderQuantity;

    private Integer stockInQuantity;

    private BigDecimal purchaseAmount;

    private String supplierName;

    private String manufacturer;

    private String registrationNumber;

    private String batchNumber;

    private LocalDate productionDate;

    private LocalDate expiryDate;

    private String status;

    private String remark;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}