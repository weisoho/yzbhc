package com.yunsheng.yzb.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class TransferOrderVO {
    private Long id;
    private String transferNumber;
    private String supplierName;
    private String materialCode;
    private String materialName;
    private String materialType;
    private String specification;
    private String model;
    private String registrationNumber;
    private String manufacturer;
    private String batchNumber;
    private Date productionDate;
    private Date expiryDate;
    private String fromWarehouse;
    private String toWarehouse;
    private String departmentName;
    private BigDecimal purchaseAmount;
    private Integer quantity;
    private String unit;
    private Date transferDate;
    private String transferor;
    private String status;
}
