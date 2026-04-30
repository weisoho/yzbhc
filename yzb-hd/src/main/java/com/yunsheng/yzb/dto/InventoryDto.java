package com.yunsheng.yzb.dto;

import lombok.Data;

@Data
public class InventoryDto {

    private Integer pageNum;
    private Integer pageSize;

    private Integer inventoryId;//仓库id
}
