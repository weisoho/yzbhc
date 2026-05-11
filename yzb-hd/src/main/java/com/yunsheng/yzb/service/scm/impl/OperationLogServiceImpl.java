package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.ScmPageHelper;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.OperationLogEntity;
import com.yunsheng.yzb.mapper.scm.OperationLogMapper;
import com.yunsheng.yzb.service.scm.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 操作日志服务实现。
 */
@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Resource
    private OperationLogMapper operationLogMapper;

    @Autowired(required = false)
    private HttpServletRequest request;

    @Override
    public void save(String userName, String operationType, String content, String status,
                     String moduleName, String referenceNo) {
        OperationLogEntity entity = new OperationLogEntity();
        entity.setOperationTime(LocalDateTime.now());
        entity.setCreateTime(LocalDateTime.now());
        entity.setUserName(userName);
        entity.setOperationType(operationType);
        entity.setContent(content);
        entity.setStatus(status);
        entity.setModuleName(moduleName);
        entity.setReferenceNo(referenceNo);
        entity.setIp(resolveClientIp());
        operationLogMapper.insert(entity);
    }

    @Override
    public PageResult<OperationLogEntity> queryLogs(ScmRequest.OperationLogQuery query) {
        LambdaQueryWrapper<OperationLogEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(StringUtils.hasText(query.getSearchText()), item -> item
                        .like(OperationLogEntity::getContent, query.getSearchText())
                        .or()
                        .like(OperationLogEntity::getIp, query.getSearchText()))
                .like(StringUtils.hasText(query.getOperatorName()), OperationLogEntity::getUserName, query.getOperatorName())
                .like(StringUtils.hasText(query.getModuleName()), OperationLogEntity::getModuleName, query.getModuleName())
                .eq(StringUtils.hasText(query.getOperationType()), OperationLogEntity::getOperationType, query.getOperationType())
                .eq(StringUtils.hasText(query.getStatus()), OperationLogEntity::getStatus, query.getStatus())
                .ge(query.getStartDate() != null, OperationLogEntity::getOperationTime, query.getStartDate() == null ? null : query.getStartDate().atStartOfDay())
                .le(query.getEndDate() != null, OperationLogEntity::getOperationTime, query.getEndDate() == null ? null : LocalDateTime.of(query.getEndDate(), LocalTime.MAX))
                .orderByDesc(OperationLogEntity::getOperationTime);
        Page<OperationLogEntity> page = operationLogMapper.selectPage(new Page<>(query.getPageNum(), query.getPageSize()), wrapper);
        return ScmPageHelper.of(page);
    }

    private String resolveClientIp() {
        if (request == null) {
            return "127.0.0.1";
        }
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
