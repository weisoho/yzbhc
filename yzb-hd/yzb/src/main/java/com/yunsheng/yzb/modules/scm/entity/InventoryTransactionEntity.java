package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 库存流水。
 */
@Data
@TableName("scm_inventory_transaction")
public class InventoryTransactionEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long inventoryId;

    private Long materialId;

    private String materialCode;

    private String materialName;

    private String batchNumber;

    private String operationType;

    private Integer quantity;

    private Integer balanceQuantity;

    private String referenceNo;

    private String operatorName;

    private String remark;

    private LocalDateTime operationTime;
}