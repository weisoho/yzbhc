package com.yunsheng.yzb.vo.scm;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExceptionOrderDetailView {
    private Long id;
    private String orderNo;
    private Long purchaseOrderId;
    private String supplierName;
    private String supplierCode;
    private String department;
    private String buyer;
    private String contactPerson;
    private String contactPhone;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;
    private String status;
    private String rejectReason;
    private String timeoutReason;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime resubmittedAt;
    private List<ScmView.PurchaseOrderItemDetail> items;
}

