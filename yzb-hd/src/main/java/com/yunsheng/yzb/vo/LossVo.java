package com.yunsheng.yzb.vo;

import lombok.Data;

/**
 * 损耗
 */
@Data
public class LossVo {
    /** 物资名称。 */
    private String materialName;
    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;
    /** 单位。 */
    private String unit;

    /** 仓库。 */
    private String warehouse;

    private Integer inventoryId;

    //上月盘点量
    private Integer lassMonthNum;

    //本月订货量
    private Integer orderMonthNum;
    //本月盘点量
    private Integer checkMonthNum;
    //损耗总量
    private Integer LossNum;

    //损耗率
    private String LossRate;
}
