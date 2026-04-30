package com.yunsheng.yzb.model;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.Date;

/**
 * 样本-项目管理
 */
@Data
public class SampleItem {
    /**
     * id
     */
    @ExcelProperty("id")
    private Integer id;

    /**
     * 项目名称
     */
    @ExcelProperty("项目名称")
    private String itemName;

    /**
     * 项目编码
     */
    @ExcelProperty("项目编码")
    private String itemCode;

    /**
     * 科室id
     */
    @ExcelProperty("科室id")
    private Integer depId;

    /**
     * 科室名字
     */
    @ExcelProperty("科室名字")
    private String depName;

    /**
     * 1启用0停用
     */
    @ExcelProperty("1启用0停用")
    private Integer itemState;

    /**
     * 备注
     */
    @ExcelProperty("备注")
    private String remark;

    /**
     * 创建时间
     */
    @ExcelProperty("创建时间")
    private Date cdate;

    /**
     * 更新时间
     */
    @ExcelProperty("更新时间")
    private Date udate;

    /**
     * 是否收费
     */
    @ExcelProperty("是否收费")
    private Integer isCharge;

    /**
     * 收费编码
     */
    @ExcelProperty("收费编码")
    private String chargeCode;

    private Integer pageNum;
    private Integer pageSize;
}