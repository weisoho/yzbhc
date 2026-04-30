package com.yunsheng.yzb.model.scm;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 供应商实体。
 */
@Data
@TableName("supplier")
public class SupplierEntity {

    /** 供应商主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 供应商名称。 */
    private String name;

    /** 企业类型。 */
    private String enterpriseType;

    /** 联系人。 */
    private String contactPerson;

    /** 联系电话。 */
    private String contactPhone;

    /** 联系地址。 */
    private String address;

    /** 供应商编码。 */
    private String supplierCode;

    /** 统一社会信用代码。 */
    private String creditCode;

    /** 税号。 */
    private String taxNumber;

    /** 法定代表人。 */
    private String legalRepresentative;

    /** 注册资本。 */
    private String registeredCapital;

    /** 注册日期。 */
    private LocalDate registrationDate;

    /** 供应商状态。 */
    private String status;

    /** 资质数量。 */
    private Integer certificateCount;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}