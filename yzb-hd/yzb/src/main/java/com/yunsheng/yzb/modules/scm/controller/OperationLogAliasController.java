package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.OperationLogEntity;
import com.yunsheng.yzb.modules.scm.service.OperationLogService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 前端兼容的操作日志接口。
 */
@RestController
@RequestMapping("/api/operation-log")
public class OperationLogAliasController {

    @Resource
    private OperationLogService operationLogService;

    @GetMapping
    public AjaxResult<PageResult<OperationLogEntity>> page(ScmRequest.OperationLogQuery query) {
        return AjaxResult.success(operationLogService.queryLogs(query));
    }
}