package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

/**
 * 样本量管理
 */
@Data
public class SampleMan {
    /**
     * id
     */
    private Integer id;

    /**
     * 日期
     */
    private Date sampleDate;

    /**
     * 科室id
     */
    private Integer depId;

    /**
     * 科室名字
     */
    private String depName;

    /**
     * 检测数
     */
    private Integer detectionNum;

    /**
     * 操作人id
     */
    private Integer userId;

    /**
     * 操作人
     */
    private String userName;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date cdate;

    /**
     * 更新时间
     */
    private Date udate;

    /**
     * 项目id
     */
    private Integer itemId;

    /**
     * 项目名字
     */
    private String itemName;

    private Integer pageNum;
    private Integer pageSize;

    //开始日期
    private Date sdate;

    //结束日期
    private Date edate;
}