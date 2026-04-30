package com.yunsheng.yzb.export;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 导出任务结果。
 */
@Data
@NoArgsConstructor
public class ExportTaskResult {
    
    /**
     * 是否成功。
     */
    private boolean success;
    
    /**
     * 消息。
     */
    private String message;
    
    /**
     * 导出的文件路径（如果是异步导出）。
     */
    private String filePath;
    
    /**
     * 导出的数据量。
     */
    private long recordCount;
    
    public ExportTaskResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public static ExportTaskResult success(String message) {
        return new ExportTaskResult(true, message);
    }
    
    public static ExportTaskResult error(String message) {
        return new ExportTaskResult(false, message);
    }
}
