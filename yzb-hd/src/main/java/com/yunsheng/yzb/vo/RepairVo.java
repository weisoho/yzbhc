package com.yunsheng.yzb.vo;

import lombok.Data;

import java.util.Date;

@Data
public class RepairVo {
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
     * 资产编码
     */
    private String assetCode;

    /**
     * 资产名字
     */
    private String assetName;


    /**
     * 资产类型名称
     */
    private String assetTypename;

    /**
     * 生产厂商
     */
    private String manufacturer;

    /**
     * 规格型号
     */
    private String speModel;

}
