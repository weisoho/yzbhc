package com.yunsheng.yzb.export;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 导出配置。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportConfig {
    
    /**
     * 批次大小（默认 1000）。
     * 控制每次从数据库查询的数据量，避免 OOM。
     */
    private int batchSize = 1000;
    
    /**
     * 线程池大小（默认 4）。
     * 控制并发处理数据的线程数。
     */
    private int threadPoolSize = 4;
    
    /**
     * 是否启用进度监听。
     */
    private boolean enableProgress = true;
    
    /**
     * 进度汇报间隔（默认每处理 1000 条汇报一次）。
     */
    private int progressInterval = 1000;
    
    /**
     * Sheet 名称（默认"Sheet1"）。
     */
    private String sheetName = "Sheet1";
    
    /**
     * 文件名前缀。
     */
    private String fileNamePrefix = "export";
    
    /**
     * 是否包含列头。
     */
    private boolean includeHeader = true;
}
