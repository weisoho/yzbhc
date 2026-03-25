package com.yunsheng.yzb.vo;

import lombok.Data;

@Data
public class CheckInventoryVo {
    /** 物资名称。 */
    private String materialName;
    /** 规格。 */
    private String specification;
    /** 货架。 */
    private String shelf;
    /** 批号。 */
    private String batchNumber;

    /** 型号。 */
    private String model;
    /**
     * 实际数量
     */
    private Integer actualNum;

    /**
     * 系统数量
     */
    private Integer sysNum;

    /**
     * 差异原因
     */
    private String diffReason;
    /**
     * 1盘亏，2盘盈，0无差异
     */
    private Integer cheStatus;
}
