package com.yunsheng.yzb.export;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 导出工具类。
 * 提供便捷的导出方法，自动处理 HTTP 响应。
 */
public class ExportUtil {
    
    private static final DateTimeFormatter FILE_NAME_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
    
    /**
     * 获取 HTTP 响应输出流。
     * 
     * @param fileName 文件名
     * @return 输出流
     */
    public static OutputStream getOutputStream(String fileName) {
        try {
            ServletRequestAttributes attributes = 
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            
            if (attributes == null) {
                throw new IllegalStateException("不在 Web 请求上下文中");
            }
            
            HttpServletResponse response = attributes.getResponse();
            if (response == null) {
                throw new IllegalStateException("HTTP Response 为空");
            }
            
            // 设置响应头
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setCharacterEncoding("utf-8");
            
            // 文件名编码处理
            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
            response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);
            
            // 禁止缓存
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Cache-Control", "no-cache");
            
            return response.getOutputStream();
            
        } catch (IOException e) {
            throw new RuntimeException("获取输出流失败", e);
        }
    }
    
    /**
     * 生成带时间戳的文件名。
     * 
     * @param prefix 文件名前缀
     * @param extension 文件扩展名
     * @return 完整文件名
     */
    public static String generateFileName(String prefix, String extension) {
        String timestamp = LocalDateTime.now().format(FILE_NAME_FORMATTER);
        return String.format("%s_%s.%s", prefix, timestamp, extension);
    }
    
    /**
     * 生成 Excel 文件名。
     * 
     * @param prefix 前缀
     * @return 文件名（.xlsx）
     */
    public static String generateExcelFileName(String prefix) {
        return generateFileName(prefix, "xlsx");
    }
}
