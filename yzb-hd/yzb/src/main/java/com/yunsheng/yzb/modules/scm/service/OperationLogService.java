package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.OperationLogEntity;

/**
 * 操作日志服务。
 */
public interface OperationLogService {

    void save(String userName, String operationType, String content, String status,
              String moduleName, String referenceNo);

    PageResult<OperationLogEntity> queryLogs(ScmRequest.OperationLogQuery query);
}