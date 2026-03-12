package com.yunsheng.yzb.vo.scm;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

/**
 * 通用分页查询参数。
 */
@Data
public class PageQuery {

    /**
     * 当前页码，从 1 开始。
     */
    @Min(value = 1, message = "页码必须大于 0")
    private long current = 1;

    /**
     * 每页记录数。
     */
    @Min(value = 1, message = "每页条数必须大于 0")
    @Max(value = 200, message = "每页条数不能超过 200")
    private long size = 10;
}