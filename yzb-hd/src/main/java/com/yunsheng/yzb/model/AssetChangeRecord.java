package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

@Data
public class AssetChangeRecord {
    private Integer id;
    private String changeCode;
    private Integer assetId;
    private String assetCode;
    private String assetName;
    private String changeType;
    private String oldValue;
    private String newValue;
    private String changeReason;
    private Date changeDate;
    private Integer applicantId;
    private String applicantName;
    private Date applyDate;
    private Integer auditStatus;
    private Integer auditorId;
    private String auditorName;
    private Date auditDate;
    private String auditRemark;
    private Integer executeStatus;
    private String executorName;
    private Date executeDate;
    private String scrapValue;
    private String remark;
    private Integer deleteFlag;
    private Integer pageNum;
    private Integer pageSize;
    private String assetTypeName;
    private String depName;
    private String applicant;
    private String auditStatusName;
    private Date startDate;
    private Date endDate;
}