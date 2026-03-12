package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.OperationLogEntity;

/**
 * 操作日志服务。
 */
public interface OperationLogService {

    /**
     * 保存业务操作日志。
     *
     * @param userName 操作人
     * @param operationType 操作类型
     * @param content 操作内容
     * @param status 操作状态
     * @param moduleName 所属模块
     * @param referenceNo 业务单号
     */
    void save(String userName, String operationType, String content, String status,
              String moduleName, String referenceNo);

    /**
     * 分页查询操作日志。
     *
     * @param query 查询条件
     * @return 操作日志分页结果
     */
    PageResult<OperationLogEntity> queryLogs(ScmRequest.OperationLogQuery query);
}