package com.yunsheng.yzb.model;

import java.util.Date;

public class Repair {
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
     * 创建日期
     */
    private Date cdate;

    /**
     * 更新时间
     */
    private Date udate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAssetId() {
        return assetId;
    }

    public void setAssetId(Integer assetId) {
        this.assetId = assetId;
    }

    public String getRepairCode() {
        return repairCode;
    }

    public void setRepairCode(String repairCode) {
        this.repairCode = repairCode == null ? null : repairCode.trim();
    }

    public Date getRepairDate() {
        return repairDate;
    }

    public void setRepairDate(Date repairDate) {
        this.repairDate = repairDate;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(Date finishDate) {
        this.finishDate = finishDate;
    }

    public Integer getRepairType() {
        return repairType;
    }

    public void setRepairType(Integer repairType) {
        this.repairType = repairType;
    }

    public String getRepairReason() {
        return repairReason;
    }

    public void setRepairReason(String repairReason) {
        this.repairReason = repairReason == null ? null : repairReason.trim();
    }

    public String getRepairContent() {
        return repairContent;
    }

    public void setRepairContent(String repairContent) {
        this.repairContent = repairContent == null ? null : repairContent.trim();
    }

    public String getRepairBus() {
        return repairBus;
    }

    public void setRepairBus(String repairBus) {
        this.repairBus = repairBus == null ? null : repairBus.trim();
    }

    public String getRepairPerson() {
        return repairPerson;
    }

    public void setRepairPerson(String repairPerson) {
        this.repairPerson = repairPerson == null ? null : repairPerson.trim();
    }

    public String getRepairFee() {
        return repairFee;
    }

    public void setRepairFee(String repairFee) {
        this.repairFee = repairFee == null ? null : repairFee.trim();
    }

    public Integer getRepairStatus() {
        return repairStatus;
    }

    public void setRepairStatus(Integer repairStatus) {
        this.repairStatus = repairStatus;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark == null ? null : remark.trim();
    }

    public Date getCdate() {
        return cdate;
    }

    public void setCdate(Date cdate) {
        this.cdate = cdate;
    }

    public Date getUdate() {
        return udate;
    }

    public void setUdate(Date udate) {
        this.udate = udate;
    }
}