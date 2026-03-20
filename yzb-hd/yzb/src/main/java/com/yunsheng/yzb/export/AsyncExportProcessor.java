package com.yunsheng.yzb.export;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 异步导出处理器。
 * 支持后台异步导出大文件，避免阻塞 HTTP 请求。
 * 
 * @param <T> 业务对象类型
 */
public class AsyncExportProcessor<T> {
    
    private final ExecutorService executor;
    
    public AsyncExportProcessor() {
        this.executor = Executors.newFixedThreadPool(4);
    }
    
    public AsyncExportProcessor(int threadPoolSize) {
        this.executor = Executors.newFixedThreadPool(threadPoolSize);
    }
    
    /**
     * 异步导出到文件。
     * 
     * @param dataList 数据列表
     * @param converter 数据转换器
     * @param filePath 文件路径
     * @param config 导出配置
     * @param listener 进度监听器
     * @return CompletableFuture<ExportTaskResult>
     */
    public CompletableFuture<ExportTaskResult> exportToFile(
            java.util.List<T> dataList,
            DataConverter<T> converter,
            String filePath,
            ExportConfig config,
            ExportProgressListener listener) {
        
        return CompletableFuture.supplyAsync(() -> {
            try (java.io.FileOutputStream fos = new java.io.FileOutputStream(filePath)) {
                ExportProcessor<T> processor = new ExportProcessor<>();
                processor.export(dataList, converter, fos, config, listener);
                return ExportTaskResult.success("导出成功，文件路径：" + filePath);
            } catch (Exception e) {
                if (listener != null) {
                    listener.onError("异步导出失败：" + e.getMessage());
                }
                return ExportTaskResult.error("导出失败：" + e.getMessage());
            }
        }, executor);
    }
    
    /**
     * 异步导出（流式）。
     * 
     * @param dataStream 数据流提供者
     * @param converter 数据转换器
     * @param filePath 文件路径
     * @param config 导出配置
     * @param listener 进度监听器
     * @return CompletableFuture<ExportTaskResult>
     */
    public CompletableFuture<ExportTaskResult> exportStreamToFile(
            java.util.function.Function<Integer, java.util.List<T>> dataStream,
            DataConverter<T> converter,
            String filePath,
            ExportConfig config,
            ExportProgressListener listener) {
        
        return CompletableFuture.supplyAsync(() -> {
            try (java.io.FileOutputStream fos = new java.io.FileOutputStream(filePath)) {
                ExportProcessor<T> processor = new ExportProcessor<>();
                processor.exportStream(dataStream, converter, fos, config, listener);
                return ExportTaskResult.success("流式导出成功，文件路径：" + filePath);
            } catch (Exception e) {
                if (listener != null) {
                    listener.onError("流式异步导出失败：" + e.getMessage());
                }
                return ExportTaskResult.error("流式导出失败：" + e.getMessage());
            }
        }, executor);
    }
    
    /**
     * 关闭线程池。
     */
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, java.util.concurrent.TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
    }
}
