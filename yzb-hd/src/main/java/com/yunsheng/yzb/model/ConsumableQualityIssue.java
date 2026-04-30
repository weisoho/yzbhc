package com.yunsheng.yzb.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ConsumableQualityIssue {
    private Long id;
    private String issueNo;
    private Long inventoryId;
    private Long materialId;
    private String materialCode;
    private String materialName;
    private String specification;
    private String model;
    private String registrationNumber;
    private String manufacturer;
    private String supplierName;
    private String batchNumber;
    private LocalDate productionDate;
    private LocalDate expiryDate;
    private Integer quantity;
    private LocalDateTime occurrenceDate;
    private String issueDescription;
    private String attachment;
    private Integer creatorId;
    private String creatorName;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleteFlag;
    private Integer pageNum;
    private Integer pageSize;
    private String supplier;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}