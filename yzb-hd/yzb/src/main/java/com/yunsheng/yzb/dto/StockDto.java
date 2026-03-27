package com.yunsheng.yzb.dto;

import lombok.Data;

@Data
public class StockDto {
    private Integer pageNum;
    private Integer pageSize;
    /** 供应商ID。 */
    private Integer supplierId;
    private Integer inventoryId;//仓库id
}
