package com.yunsheng.yzb.utils;

import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 单号生成工具类
 */
public class SnGenerateUtil {

    private static int counter = 0;         //订单计数器
    private static final int MAX_COUNTER = 9999;  //订单计数器最大值
    private static final Pattern CODE_PATTERN = Pattern.compile("(\\d{10})$");
    //private static final String PREFIX = "PD";     //订单号前缀
    //前嘴和数据库中最大的数值
    public static String generate(String PREFIX,String maxSn) {
        counter++;      //增加计数器值
        if (counter > MAX_COUNTER) {    //如果计数器达到最大值，重置为0
            counter = 0;
        }
        //获取当前年份 2023 取23
        String year = String.valueOf(Calendar.getInstance().get(Calendar.YEAR)).substring(2, 4);
        //获取当前月份，注意需要加上1
        String month = String.format("%02d", Calendar.getInstance().get(Calendar.MONTH) + 1);
        //获取当前日期
        String day = String.format("%02d", Calendar.getInstance().get(Calendar.DATE));
        //格式化计数器值为4位数字
        String sequence = String.format("%04d", counter);

        //拼接订单号
        String orderNumber = PREFIX + year + month + day + sequence;

        //连接数据库，检查该订单号是否已存在
        //这里模拟查库 返回最新的单号"select order_num from  order ORDER BY order_num desc limit 1"
        //String maxSn = "2311230010";
        if (maxSn != null) {
            Matcher matcher = CODE_PATTERN.matcher(maxSn.trim());
            if (!matcher.find()) {
                return orderNumber;
            }

            String maxSnStr = matcher.group(1);
            String yyyy = maxSnStr.substring(0, 2);
            String mm = maxSnStr.substring(2, 6);
            Integer count = Integer.parseInt(maxSnStr.substring(6, 10));

            //如果年月相同，且计数小于等于 库里的最大单号，需要重新生成
            String monthDay = month + day;
            if (year.equals(yyyy) && monthDay.equals(mm) && count >= counter) {
                counter = count;
                return generate(PREFIX,maxSn);
            }
        }
        //返回生成的订单号
        return orderNumber;
    }
}