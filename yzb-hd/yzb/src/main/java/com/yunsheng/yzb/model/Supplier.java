package com.yunsheng.yzb.model;

import java.util.Date;

/**
 * 供应商实体类
 * 对应数据库表：supplier
 */
public class Supplier {
    /**
     * 供应商ID (主键)
     */
    private Integer id;

    /**
     * 供应商名称
     */
    private String name;

    /**
     * 联系人
     */
    private String contactPerson;

    /**
     * 联系电话
     */
    private String contactPhone;

    /**
     * 供应商地址
     */
    private String address;

    /**
     * 注册证号
     */
    private String registrationNumber;

    /**
     * 企业类型 (如：生产企业、经营企业、医疗机构等)
     */
    private String enterpriseType;

    /**
     * 状态 (1: 正常, 0: 禁用)
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
     * 获取供应商ID
     * @return id
     */
    public Integer getId() { return id; }

    /**
     * 设置供应商ID
     * @param id 供应商ID
     */
    public void setId(Integer id) { this.id = id; }

    /**
     * 获取供应商名称
     * @return name
     */
    public String getName() { return name; }

    /**
     * 设置供应商名称
     * @param name 供应商名称
     */
    public void setName(String name) { this.name = name; }

    /**
     * 获取联系人
     * @return contactPerson
     */
    public String getContactPerson() { return contactPerson; }

    /**
     * 设置联系人
     * @param contactPerson 联系人
     */
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    /**
     * 获取联系电话
     * @return contactPhone
     */
    public String getContactPhone() { return contactPhone; }

    /**
     * 设置联系电话
     * @param contactPhone 联系电话
     */
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    /**
     * 获取地址
     * @return address
     */
    public String getAddress() { return address; }

    /**
     * 设置地址
     * @param address 地址
     */
    public void setAddress(String address) { this.address = address; }

    /**
     * 获取注册证号
     * @return registrationNumber
     */
    public String getRegistrationNumber() { return registrationNumber; }

    /**
     * 设置注册证号
     * @param registrationNumber 注册证号
     */
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    /**
     * 获取企业类型
     * @return enterpriseType
     */
    public String getEnterpriseType() { return enterpriseType; }

    /**
     * 设置企业类型
     * @param enterpriseType 企业类型
     */
    public void setEnterpriseType(String enterpriseType) { this.enterpriseType = enterpriseType; }

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
