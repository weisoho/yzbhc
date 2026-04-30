package com.yunsheng.yzb.vo.scm;

import lombok.Data;

import java.time.LocalDate;

/**
 * 厂商资质预警视图对象。
 */
@Data
public class ManufacturerQualificationWarningView {
    /** 资质主键。 */
    private Long qualificationId;
    /** 供应商主键。 */
    private Long supplierId;
    /** 供应商名称。 */
    private String supplierName;
    /** 生产厂家。 */
    private String manufacturer;
    /** 受影响产品数。 */
    private Integer productCount;
    /** 资质类型。 */
    private String type;
    /** 资质名称。 */
    private String certificateName;
    /** 证件编号。 */
    private String licenseNumber;
    /** 有效期。 */
    private LocalDate expiryDate;
    /** 资质状态。 */
    private String status;
}

