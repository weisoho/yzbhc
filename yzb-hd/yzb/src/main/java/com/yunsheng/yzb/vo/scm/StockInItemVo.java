package com.yunsheng.yzb.vo.scm;

import lombok.Data;

@Data
public class StockInItemVo {
    /** 物资名称。 */
    private String materialName;

    /** 规格。 */
    private String specification;

    /** 型号。 */
    private String model;


    /** 单位。 */
    private String unit;

    private String inventory;//仓库


    /** 供应商名称。 */
    private String supplierName;

    private Integer allStockNum;//入库总数



}
