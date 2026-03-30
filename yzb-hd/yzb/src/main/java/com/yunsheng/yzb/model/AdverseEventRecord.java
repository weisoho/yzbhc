package com.yunsheng.yzb.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdverseEventRecord {
    private Long id;
    private String eventNo;
    private String patientName;
    private String gender;
    private Integer age;
    private String patientId;
    private String hospitalizationNo;
    private String involvedProject;
    private String eventName;
    private LocalDateTime occurrenceDate;
    private String eventSummary;
    private String investigationSituation;
    private String eventAnalysis;
    private String eventSummaryDetail;
    private String handlingResult;
    private String rectificationMeasures;
    private String attachment;
    private Integer recorderId;
    private String recorderName;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleteFlag;
    private Integer pageNum;
    private Integer pageSize;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}