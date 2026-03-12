package com.yunsheng.yzb.modules.scm.entity;

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

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long stockOutOrderId;

    private Long inventoryId;

    private Long materialId;

    private String materialCode;

    private String materialName;

    private String materialType;

    private String specification;

    private String model;

    private String unit;

    private String supplier;

    private String manufacturer;

    private String registrationNumber;

    private String batchNumber;

    private LocalDate productionDate;

    private LocalDate expiryDate;

    private BigDecimal unitPrice;

    private Integer outboundQuantity;

    private LocalDate outboundDate;

    private String status;

    private String undoStatus;

    private String reason;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}