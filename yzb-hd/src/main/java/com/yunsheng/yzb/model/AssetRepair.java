package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;
@Data
public class AssetRepair {
    /**
     * id
     */
    private Integer id;

    /**
     * 资产id
     */
    private Integer assetId;

    /**
     * 维修单号
     */
    private String repairCode;

    /**
     * 维修日期
     */
    private Date repairDate;

    /**
     * 完成日期
     */
    private Date finishDate;

    /**
     * 维修类型1定期维修2故障维修
     */
    private Integer repairType;

    /**
     * 维修原因
     */
    private String repairReason;

    /**
     * 维修内容
     */
    private String repairContent;

    /**
     * 维修商家
     */
    private String repairBus;

    /**
     * 维修人员
     */
    private String repairPerson;

    /**
     * 维修费用
     */
    private String repairFee;

    /**
     * 1待处理2处理中3已完成
     */
    private Integer repairStatus;

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
     * 资产编码
     */
    private String assetCode;

    /**
     * 资产名
     */
    private String assetName;

    /**
     * 资产类型
     */
    private String assetType;

    /**
     * 资产类型iD
     */
    private Integer assetTypeId;

    /**
     * 厂家
     */
    private String manufacturer;

    /**
     * 型号规格
     */
    private String speModel;

    /**
     * 科室id
     */
    private Integer depId;

    /**
     * 创建人id
     */
    private Integer userId;

    private Integer pageNum;
    private Integer pageSize;
    //开始时间

    private Date date1;
    //结束时间
    private Date date2;

}