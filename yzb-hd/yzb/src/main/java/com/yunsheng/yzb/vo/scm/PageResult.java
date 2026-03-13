package com.yunsheng.yzb.vo.scm;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * 通用分页结果。
 */
@Data
@AllArgsConstructor
public class PageResult<T> {

    /**
     * 当前页码。
     */
    private long pageNum;

    /**
     * 每页记录数。
     */
    private long pageSize;

    /**
     * 总记录数。
     */
    private long total;

    /**
     * 当前页数据列表。
     */
    private List<T> records;
}