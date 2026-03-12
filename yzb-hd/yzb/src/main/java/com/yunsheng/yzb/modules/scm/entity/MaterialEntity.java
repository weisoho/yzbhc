package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 物资字典实体。
 */
@Data
@TableName("scm_material")
public class MaterialEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String materialCode;

    private String name;

    private String materialType;

    private String specification;

    private String model;

    private String minPackage;

    private String unit;

    private BigDecimal purchasePrice;

    private Long supplierId;

    private String supplierName;

    private Long qualificationId;

    private String registrationNumber;

    private String manufacturer;

    private String storageCondition;

    private String status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}