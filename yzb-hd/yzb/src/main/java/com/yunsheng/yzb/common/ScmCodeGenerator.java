package com.yunsheng.yzb.common;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 单号与编码生成工具。
 */
public final class ScmCodeGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    private ScmCodeGenerator() {
    }

    public static <T> String nextCode(BaseMapper<T> mapper, String prefix, String columnName) {
        String datePart = LocalDate.now().format(DATE_FORMATTER);
        String fullPrefix = prefix + datePart;
        String lastCode = mapper.selectObjs(new QueryWrapper<T>()
                        .select(columnName)
                        .likeRight(columnName, fullPrefix)
                        .orderByDesc(columnName)
                        .last("limit 1"))
                .stream()
                .findFirst()
                .map(String::valueOf)
                .orElse(null);
        int next = 1;
        if (lastCode != null && lastCode.length() >= 4) {
            next = Integer.parseInt(lastCode.substring(lastCode.length() - 4)) + 1;
        }
        return fullPrefix + String.format("%04d", next);
    }
}