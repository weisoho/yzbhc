package com.yunsheng.yzb.vo;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * 调拨单创建参数。
 */
@Data
public class TransferOrderCreateSave {

    @NotBlank(message = "调出仓库不能为空")
    private String fromWarehouse;

    @NotBlank(message = "调入仓库不能为空")
    private String toWarehouse;

    @NotBlank(message = "调拨人不能为空")
    private String operatorName;

    @NotBlank(message = "调拨日期不能为空")
    private String transferDate;

    private String remark;

    @Valid
    @NotEmpty(message = "请选择至少一条调拨明细")
    private List<Item> items;

    @Data
    public static class Item {

        @NotNull(message = "库存记录不能为空")
        private Long inventoryId;

        @NotNull(message = "调拨数量不能为空")
        @Min(value = 1, message = "调拨数量必须大于 0")
        private Integer quantity;
    }
}
