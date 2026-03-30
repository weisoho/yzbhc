package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

@Data
public class AssetWarningView {
    private Integer assetId;
    private Integer pageNum;
    private Integer pageSize;
    private String assetCode;
    private String assetName;
    private String assetType;
    private String manufacturer;
    private String specification;
    private String department;
    private String responsiblePerson;
    private String warningType;
    private String warningLevel;
    private Date warningDate;
    private Date dueDate;
    private Integer daysLeft;
    private Integer status;
    private String description;
    private String actionRequired;
    private String remark;
    private Date purchaseDate;
    private String originalValue;
    private String usefulLife;
    private Integer recordId;
}