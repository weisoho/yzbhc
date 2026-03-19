package com.yunsheng.yzb.model.scm;

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

    /** 物资主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 物资编码。 */
    private String materialCode;

    /** 物资名称。 */
    private String name;

    /** 物资类型。 */
    private String materialType;

    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;

    /** 最小包装。 */
    private String minPackage;

    /** 单位。 */
    private String unit;

    /** 采购价格。 */
    private BigDecimal purchasePrice;

    /** 供应商主键。 */
    private Long supplierId;

    /** 供应商名称。 */
    private String supplierName;

    /** 资质主键。 */
    private Long qualificationId;

    /** 注册证号。 */
    private String registrationNumber;

    /** 生产厂家。 */
    private String manufacturer;

    /** 存储条件。 */
    private String storageCondition;

    /** 物资状态。 */
    private String status;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}