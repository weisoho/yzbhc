package com.yunsheng.yzb.modules.scm.common;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.yunsheng.yzb.modules.scm.dto.PageResult;

/**
 * 分页结果转换工具。
 */
public final class ScmPageHelper {

    private ScmPageHelper() {
    }

    public static <T> PageResult<T> of(IPage<T> page) {
        return new PageResult<>(page.getCurrent(), page.getSize(), page.getTotal(), page.getRecords());
    }
}