package com.yunsheng.yzb.modules.scm.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 操作日志实体。
 */
@Data
@TableName("scm_operation_log")
public class OperationLogEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private LocalDateTime operationTime;

    private String userName;

    private String operationType;

    private String content;

    private String status;

    private String ip;

    private String moduleName;

    private String referenceNo;

    private LocalDateTime createTime;
}