package com.yunsheng.yzb.model;

import java.util.Date;

/**
 * 供应商资质实体类
 * 对应数据库表：supplier_qualification
 */
public class SupplierQualification {
    /**
     * 资质ID (主键)
     */
    private Integer id;

    /**
     * 供应商ID (关联 supplier 表)
     */
    private Integer supplierId;

    /**
     * 资质类型 (如：BUSINESS_LICENSE-营业执照, BUSINESS_CERTIFICATE-经营许可证, INSPECTION_REPORT-检验报告)
     */
    private String type;

    /**
     * 证件编号
     */
    private String licenseNumber;

    /**
     * 证件具体类别 (如：医疗器械经营许可证、药品经营许可证等)
     */
    private String licenseType;

    /**
     * 发证日期
     */
    private Date issueDate;

    /**
     * 有效期至
     */
    private Date expiryDate;

    /**
     * 发证机关/检验机构
     */
    private String issuingAuthority;

    /**
     * 证件文件路径
     */
    private String licenseFile;

    /**
     * 状态 (1: 有效, 0: 过期, 2: 即将过期)
     */
    private String status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    // Getters and Setters

    /**
     * 获取资质ID
     * @return id
     */
    public Integer getId() { return id; }

    /**
     * 设置资质ID
     * @param id 资质ID
     */
    public void setId(Integer id) { this.id = id; }

    /**
     * 获取供应商ID
     * @return supplierId
     */
    public Integer getSupplierId() { return supplierId; }

    /**
     * 设置供应商ID
     * @param supplierId 供应商ID
     */
    public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }

    /**
     * 获取资质类型
     * @return type
     */
    public String getType() { return type; }

    /**
     * 设置资质类型
     * @param type 资质类型
     */
    public void setType(String type) { this.type = type; }

    /**
     * 获取证件编号
     * @return licenseNumber
     */
    public String getLicenseNumber() { return licenseNumber; }

    /**
     * 设置证件编号
     * @param licenseNumber 证件编号
     */
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    /**
     * 获取证件具体类别
     * @return licenseType
     */
    public String getLicenseType() { return licenseType; }

    /**
     * 设置证件具体类别
     * @param licenseType 证件具体类别
     */
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }

    /**
     * 获取发证日期
     * @return issueDate
     */
    public Date getIssueDate() { return issueDate; }

    /**
     * 设置发证日期
     * @param issueDate 发证日期
     */
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }

    /**
     * 获取有效期至
     * @return expiryDate
     */
    public Date getExpiryDate() { return expiryDate; }

    /**
     * 设置有效期至
     * @param expiryDate 有效期至
     */
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }

    /**
     * 获取发证机关
     * @return issuingAuthority
     */
    public String getIssuingAuthority() { return issuingAuthority; }

    /**
     * 设置发证机关
     * @param issuingAuthority 发证机关
     */
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }

    /**
     * 获取证件文件路径
     * @return licenseFile
     */
    public String getLicenseFile() { return licenseFile; }

    /**
     * 设置证件文件路径
     * @param licenseFile 证件文件路径
     */
    public void setLicenseFile(String licenseFile) { this.licenseFile = licenseFile; }

    /**
     * 获取状态
     * @return status
     */
    public String getStatus() { return status; }

    /**
     * 设置状态
     * @param status 状态
     */
    public void setStatus(String status) { this.status = status; }

    /**
     * 获取创建时间
     * @return createTime
     */
    public Date getCreateTime() { return createTime; }

    /**
     * 设置创建时间
     * @param createTime 创建时间
     */
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    /**
     * 获取更新时间
     * @return updateTime
     */
    public Date getUpdateTime() { return updateTime; }

    /**
     * 设置更新时间
     * @param updateTime 更新时间
     */
    public void setUpdateTime(Date updateTime) { this.updateTime = updateTime; }
}
