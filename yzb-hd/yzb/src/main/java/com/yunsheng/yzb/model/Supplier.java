package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

/**
 * 供应商实体类
 * 对应数据库表：supplier
 */
@Data
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
     * 企业信用代码
     */
    private String creditCode;

    /**
     * 企业税号
     */
    private String taxNumber;

    /**
     * 院内供应商编码
     */
    private String supplierCode;

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
}
