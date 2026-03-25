package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;
@Data
public class CheckInventory {
    /**
     * id
     */
    private Integer id;

    /**
     * 盘点编码
     */
    private String cheCode;

    /**
     * 仓库id
     */
    private Integer inventoryId;

    /**
     * 仓库名字
     */
    private String inventoryName;

    /**
     * 创建日期
     */
    private Date cdate;

    /**
     * 更新时间
     */
    private Date udate;

    /**
     * 状态1盘点完成，0未盘点，2已记录损失盈利
     */
    private Integer status;

    /**
     * 盘点人id
     */
    private Integer userId;

    /**
     * 盘点人名字
     */
    private String userName;

    /**
     * 盘点部门id
     */
    private Integer depId;

    /**
     * 盘点部门
     */
    private String depName;

    /**
     * 实际数量
     */
    private Integer actualNum;

    /**
     * 系统数量
     */
    private Integer sysNum;

    /**
     * 差异原因
     */
    private String diffReason;

    /**
     * 1盘亏，2盘盈，0无差异
     */
    private Integer cheStatus;

    /**
     * 盘点日期
     */
    private Date cheDate;

    private Integer pageNum;
    private Integer pageSize;
}