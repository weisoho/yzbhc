package com.yunsheng.yzb.export;

/**
 * 导出进度监听器接口。
 * 用于实时监控大批量导出的进度。
 */
public interface ExportProgressListener {
    
    /**
     * 进度更新回调。
     * 
     * @param current 当前已处理数量
     * @param total 总数量
     * @param message 进度消息
     */
    void onProgressUpdate(long current, long total, String message);
    
    /**
     * 导出完成回调。
     * 
     * @param success 是否成功
     * @param message 完成消息
     */
    void onComplete(boolean success, String message);
    
    /**
     * 错误回调。
     * 
     * @param error 错误信息
     */
    void onError(String error);
}
