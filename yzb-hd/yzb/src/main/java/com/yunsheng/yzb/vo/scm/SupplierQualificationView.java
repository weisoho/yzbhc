package com.yunsheng.yzb.vo.scm;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 供应商资质视图对象。
 */
@Data
public class SupplierQualificationView {
    /** 资质主键。 */
    private Long id;
    /** 供应商主键。 */
    private Long supplierId;
    /** 供应商名称。 */
    private String supplierName;
    /** 统一社会信用代码。 */
    private String creditCode;
    /** 法定代表人。 */
    private String legalRepresentative;
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
    /** 注册资本。 */
    private String registeredCapital;
    /** 注册日期。 */
    private LocalDate registrationDate;
    /** 住所。 */
    private String address;
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
