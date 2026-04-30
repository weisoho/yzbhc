package com.yunsheng.yzb.export;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import java.io.OutputStream;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;

/**
 * 基于策略模式的通用导出处理器。
 * 支持百万级数据导出，采用多线程、分批次处理。
 * 
 * @param <T> 业务对象类型
 */
public class ExportProcessor<T> {
    
    /**
     * 执行导出。
     * 
     * @param dataList 数据列表（支持大数据集）
     * @param converter 数据转换器
     * @param outputStream 输出流
     * @param config 导出配置
     * @param listener 进度监听器
     */
    public void export(List<T> dataList, DataConverter<T> converter, 
                       OutputStream outputStream, ExportConfig config, 
                       ExportProgressListener listener) {
        exportInternal(dataList, converter, outputStream, config, listener);
    }
    
    /**
     * 异步导出
     * 
     * @param dataList 数据列表
     * @param converter 数据转换器
     * @param outputStream 输出流
     * @param config 导出配置
     * @param listener 进度监听器
     */
    private void exportInternal(List<T> dataList, DataConverter<T> converter,
                                OutputStream outputStream, ExportConfig config,
                                ExportProgressListener listener) {

        if (dataList == null || dataList.isEmpty()) {
            if (listener != null) {
                listener.onComplete(false, "数据为空");
            }
            return;
        }

        long total = dataList.size();

        try (SXSSFWorkbook workbook = new SXSSFWorkbook(1000)) {
            workbook.setCompressTempFiles(true);
            Sheet sheet = workbook.createSheet(config.getSheetName());

            // 列头样式
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            // 写入列头
            int rowNum = 0;
            if (config.isIncludeHeader()) {
                Row headerRow = sheet.createRow(rowNum++);
                String[] headers = converter.getHeaders();
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(headerStyle);
                }
            }

            // 进度跟踪
            AtomicLong processedCount = new AtomicLong(0);

            // SXSSF 不是线程安全对象，必须单线程顺序写入。
            for (T item : dataList) {
                Row row = sheet.createRow(rowNum++);
                String[] values = converter.convert(item);

                for (int i = 0; i < values.length; i++) {
                    Cell cell = row.createCell(i);
                    cell.setCellValue(values[i] != null ? values[i] : "");
                    cell.setCellStyle(dataStyle);
                }

                long count = processedCount.incrementAndGet();
                reportProgress(listener, count, total, config);
            }

            // 刷新到输出流
            workbook.write(outputStream);

            if (listener != null) {
                listener.onProgressUpdate(total, total, "导出完成");
                listener.onComplete(true, "成功导出 " + total + " 条记录");
            }

        } catch (Exception e) {
            if (listener != null) {
                listener.onError("导出失败：" + e.getMessage());
            }
            throw new RuntimeException("导出失败", e);
        }
    }
    
    /**
     * 使用 Stream 流方式导出（更简洁）。
     * 
     * @param dataStream 数据提供者（支持懒加载）
     * @param converter 数据转换器
     * @param outputStream 输出流
     * @param config 导出配置
     * @param listener 进度监听器
     */
    public void exportStream(Function<Integer, List<T>> dataStream, 
                            DataConverter<T> converter,
                            OutputStream outputStream, 
                            ExportConfig config,
                            ExportProgressListener listener) {
        
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(1000)) {
            workbook.setCompressTempFiles(true);
            Sheet sheet = workbook.createSheet(config.getSheetName());
            
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            
            int rowNum = 0;
            
            // 写入列头
            if (config.isIncludeHeader()) {
                Row headerRow = sheet.createRow(rowNum++);
                String[] headers = converter.getHeaders();
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(headerStyle);
                }
            }
            
            AtomicLong totalCount = new AtomicLong(0);
            int page = 0;
            List<T> data;
            
            // 分页获取数据并写入
            while (!(data = dataStream.apply(page++)).isEmpty()) {
                for (T item : data) {
                    Row row = sheet.createRow(rowNum++);
                    String[] values = converter.convert(item);
                    
                    for (int i = 0; i < values.length; i++) {
                        Cell cell = row.createCell(i);
                        cell.setCellValue(values[i] != null ? values[i] : "");
                        cell.setCellStyle(dataStyle);
                    }
                    
                    long count = totalCount.incrementAndGet();
                    reportProgress(listener, count, Long.MAX_VALUE, config);
                }
            }
            
            workbook.write(outputStream);
            
            if (listener != null) {
                listener.onComplete(true, "成功导出 " + totalCount.get() + " 条记录");
            }
            
        } catch (Exception e) {
            if (listener != null) {
                listener.onError("流式导出失败：" + e.getMessage());
            }
            throw new RuntimeException("流式导出失败", e);
        }
    }
    
    /**
     * 创建列头样式。
     */
    private CellStyle createHeaderStyle(SXSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
    
    /**
     * 创建数据样式。
     */
    private CellStyle createDataStyle(SXSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setWrapText(true);
        return style;
    }
    
    /**
     * 汇报进度。
     */
    private void reportProgress(ExportProgressListener listener, 
                               long current, long total, ExportConfig config) {
        if (listener != null && config.isEnableProgress() && 
            current % config.getProgressInterval() == 0) {
            if (total > 0 && total != Long.MAX_VALUE) {
                double percent = (current * 100.0) / total;
                listener.onProgressUpdate(current, total,
                        String.format("已处理 %d/%d 条 (%.2f%%)", current, total, percent));
            } else {
                listener.onProgressUpdate(current, total,
                        String.format("已处理 %d 条", current));
            }
        }
    }
}
