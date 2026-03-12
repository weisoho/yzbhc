package com.yunsheng.yzb.model.scm;

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

    /** 流水主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 库存主键。 */
    private Long inventoryId;

    /** 物资主键。 */
    private Long materialId;

    /** 物资编码。 */
    private String materialCode;

    /** 物资名称。 */
    private String materialName;

    /** 批号。 */
    private String batchNumber;

    /** 操作类型。 */
    private String operationType;

    /** 变动数量。 */
    private Integer quantity;

    /** 变动后余额。 */
    private Integer balanceQuantity;

    /** 关联单号。 */
    private String referenceNo;

    /** 操作人。 */
    private String operatorName;

    /** 备注。 */
    private String remark;

    /** 操作时间。 */
    private LocalDateTime operationTime;
}