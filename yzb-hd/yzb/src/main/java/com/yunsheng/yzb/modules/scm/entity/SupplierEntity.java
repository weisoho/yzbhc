package com.yunsheng.yzb.modules.scm.entity;

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

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String enterpriseType;

    private String contactPerson;

    private String contactPhone;

    private String address;

    private String supplierCode;

    private String creditCode;

    private String taxNumber;

    private String legalRepresentative;

    private String registeredCapital;

    private LocalDate registrationDate;

    private String status;

    private Integer certificateCount;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}