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
 * 操作日志接口。
 */
@RestController
@RequestMapping("/api/scm/operation-logs")
public class OperationLogController {

    @Resource
    private OperationLogService operationLogService;

    @GetMapping
    public AjaxResult<PageResult<OperationLogEntity>> page(ScmRequest.OperationLogQuery query) {
        return AjaxResult.success(operationLogService.queryLogs(query));
    }
}