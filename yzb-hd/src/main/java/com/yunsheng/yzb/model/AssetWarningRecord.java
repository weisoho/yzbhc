package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

@Data
public class AssetWarningRecord {
    private Integer id;
    private Integer assetId;
    private String assetCode;
    private String assetName;
    private String warningType;
    private String warningLevel;
    private Date warningDate;
    private Date dueDate;
    private Integer daysLeft;
    private Integer status;
    private String description;
    private String actionRequired;
    private Integer handlerId;
    private String handlerName;
    private Date handleTime;
    private String remark;
}