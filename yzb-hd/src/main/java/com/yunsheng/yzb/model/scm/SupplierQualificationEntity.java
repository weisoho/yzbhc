package com.yunsheng.yzb.model.scm;

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

    /** 资质主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 供应商主键。 */
    private Long supplierId;

    /** 资质类型。 */
    private String type;

    /** 资质名称。 */
    private String certificateName;

    /** 证件编号。 */
    private String licenseNumber;

    /** 证件类别。 */
    private String licenseType;

    /** 发证日期。 */
    private LocalDate issueDate;

    /** 有效期。 */
    private LocalDate expiryDate;

    /** 发证机构。 */
    private String issuingAuthority;

    /** 注册人名称。 */
    private String registrantName;

    /** 代理人名称。 */
    private String agentName;

    /** 附件名称。 */
    private String attachmentName;

    /** 附件地址。 */
    private String licenseFile;

    /** 资质状态。 */
    private String status;

    /** 创建时间。 */
    private LocalDateTime createTime;

    /** 更新时间。 */
    private LocalDateTime updateTime;
}