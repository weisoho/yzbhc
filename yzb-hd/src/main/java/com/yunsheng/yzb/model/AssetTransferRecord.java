package com.yunsheng.yzb.model;

import java.util.Date;

public class AssetTransferRecord {
    /**
     * id
     */
    private Integer id;

    /**
     * 调拨id
     */
    private Integer transferId;

    /**
     * 创建日期
     */
    private Date cdate;

    /**
     * 更新日期
     */
    private Date udate;

    /**
     * 接收人id
     */
    private Integer userId;

    /**
     * 接收人
     */
    private String userName;

    /**
     * 1完好无损，2轻微磨损，3需要维修，4严重损坏
     */
    private Integer assetStatus;

    /**
     * 配件清单
     */
    private String assetParts;

    /**
     * 备注
     */
    private String remark;

    /**
     * 0待接受，1已接收，2未接受
     */
    private Integer status;

    /**
     * 原因
     */
    private String reason;

    /**
     * 责任人
     */
    private String respPersion;

    /**
     * 新责任人iD
     */
    private Integer respPersionId;

    /**
     * 仓库id
     */
    private Integer inventoryId;

    /**
     * 仓库名字
     */
    private String inventoryName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTransferId() {
        return transferId;
    }

    public void setTransferId(Integer transferId) {
        this.transferId = transferId;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public Integer getAssetStatus() {
        return assetStatus;
    }

    public void setAssetStatus(Integer assetStatus) {
        this.assetStatus = assetStatus;
    }

    public String getAssetParts() {
        return assetParts;
    }

    public void setAssetParts(String assetParts) {
        this.assetParts = assetParts == null ? null : assetParts.trim();
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark == null ? null : remark.trim();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason == null ? null : reason.trim();
    }

    public String getRespPersion() {
        return respPersion;
    }

    public void setRespPersion(String respPersion) {
        this.respPersion = respPersion == null ? null : respPersion.trim();
    }

    public Integer getRespPersionId() {
        return respPersionId;
    }

    public void setRespPersionId(Integer respPersionId) {
        this.respPersionId = respPersionId;
    }

    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Integer inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getInventoryName() {
        return inventoryName;
    }

    public void setInventoryName(String inventoryName) {
        this.inventoryName = inventoryName == null ? null : inventoryName.trim();
    }
}