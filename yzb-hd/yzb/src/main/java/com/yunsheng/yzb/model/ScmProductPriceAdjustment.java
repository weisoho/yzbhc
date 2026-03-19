package com.yunsheng.yzb.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("scm_product_price_adjustment")
public class ScmProductPriceAdjustment {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String materialCode;
    private String name;
    private String materialType;
    private String specification;
    private String model;
    private String minPackage;
    private String unit;
    private BigDecimal purchasePrice;
    private String registrationNumber;
    private String supplier;
    private String manufacturer;
    private String adjustmentReason;
    private BigDecimal currentPrice;
    private BigDecimal costPrice;
    private BigDecimal oldPrice;
    private BigDecimal newPrice;
    private BigDecimal adjustmentAmount;
    private BigDecimal adjustmentPercent;
    private String adjustedBy;
    private LocalDateTime adjustedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
