package com.yunsheng.yzb.modules.scm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * 通用分页结果。
 */
@Data
@AllArgsConstructor
public class PageResult<T> {

    private long current;

    private long size;

    private long total;

    private List<T> records;
}