package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.OperationLogEntity;
import com.yunsheng.yzb.service.scm.OperationLogService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 操作日志控制器。
 * 提供供应链业务操作日志查询接口。
 */
@RestController
@RequestMapping("/api/scm/operation-logs")
public class OperationLogController {

    /**
     * 操作日志服务。
     */
    @Resource
    private OperationLogService operationLogService;

    /**
     * 分页查询操作日志。
     *
     * @param query 日志分页查询条件
     * @return 操作日志分页结果
     */
    @GetMapping
    public AjaxResult<PageResult<OperationLogEntity>> page(ScmRequest.OperationLogQuery query) {
        return AjaxResult.success(operationLogService.queryLogs(query));
    }
}