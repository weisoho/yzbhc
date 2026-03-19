package com.yunsheng.yzb.model.scm;

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

    /** 日志主键。 */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 操作时间。 */
    private LocalDateTime operationTime;

    /** 操作用户。 */
    private String userName;

    /** 操作类型。 */
    private String operationType;

    /** 操作内容。 */
    private String content;

    /** 执行状态。 */
    private String status;

    /** 来源 IP。 */
    private String ip;

    /** 所属模块。 */
    private String moduleName;

    /** 关联单号。 */
    private String referenceNo;

    /** 创建时间。 */
    private LocalDateTime createTime;
}