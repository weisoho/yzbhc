package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 供应商资质实体。
 */
@Data
@TableName("supplier_qualification")
public class SupplierQualificationEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long supplierId;

    private String type;

    private String certificateName;

    private String licenseNumber;

    private String licenseType;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    private String issuingAuthority;

    private String attachmentName;

    private String licenseFile;

    private String status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}