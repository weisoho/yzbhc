package com.yunsheng.yzb.export;

/**
 * 导出数据转换策略接口。
 * 定义如何将业务对象转换为可导出的数据行。
 * 
 * @param <T> 业务对象类型
 */
public interface DataConverter<T> {
    
    /**
     * 将业务对象转换为字符串数组（一行数据）。
     * 
     * @param item 业务对象
     * @return 字符串数组，每个元素对应 Excel 的一个单元格
     */
    String[] convert(T item);
    
    /**
     * 获取列头信息。
     * 
     * @return 列头数组
     */
    String[] getHeaders();
}
