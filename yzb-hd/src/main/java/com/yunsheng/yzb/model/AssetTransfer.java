package com.yunsheng.yzb.model;

import java.util.Date;

public class AssetTransfer {
    /**
     * id
     */
    private Integer id;

    /**
     * 资产id
     */
    private Integer assetId;

    /**
     * 调拨来源部门id
     */
    private Integer depId;

    /**
     * 创建时间
     */
    private Date cdate;

    /**
     * 更新时间
     */
    private Date udate;

    /**
     * 调拨单号
     */
    private String transferCode;

    /**
     * 资产编码
     */
    private String assetCode;

    /**
     * 资产名称
     */
    private String assetName;

    /**
     * 资产类型id
     */
    private Integer assetTypeid;

    /**
     * 资产类型名称
     */
    private String assetTypename;

    /**
     * 规格型号
     */
    private String speModel;

    /**
     * 原值
     */
    private String origValue;

    /**
     * 接受部门id
     */
    private Integer bedepId;

    /**
     * 调拨人id
     */
    private Integer userId;

    /**
     * 调拨人
     */
    private String userName;

    /**
     * 
     */
    private String depName;

    /**
     * 
     */
    private String bedepName;

    /**
     * 状态1待接受，2通过，3，拒绝
     */
    private Integer status;

    private Integer pageNum;

    private Integer pageSize;

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

    public Integer getDepId() {
        return depId;
    }

    public void setDepId(Integer depId) {
        this.depId = depId;
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

    public String getTransferCode() {
        return transferCode;
    }

    public void setTransferCode(String transferCode) {
        this.transferCode = transferCode == null ? null : transferCode.trim();
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode == null ? null : assetCode.trim();
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName == null ? null : assetName.trim();
    }

    public Integer getAssetTypeid() {
        return assetTypeid;
    }

    public void setAssetTypeid(Integer assetTypeid) {
        this.assetTypeid = assetTypeid;
    }

    public String getAssetTypename() {
        return assetTypename;
    }

    public void setAssetTypename(String assetTypename) {
        this.assetTypename = assetTypename == null ? null : assetTypename.trim();
    }

    public String getSpeModel() {
        return speModel;
    }

    public void setSpeModel(String speModel) {
        this.speModel = speModel == null ? null : speModel.trim();
    }

    public String getOrigValue() {
        return origValue;
    }

    public void setOrigValue(String origValue) {
        this.origValue = origValue == null ? null : origValue.trim();
    }

    public Integer getBedepId() {
        return bedepId;
    }

    public void setBedepId(Integer bedepId) {
        this.bedepId = bedepId;
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

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName == null ? null : depName.trim();
    }

    public String getBedepName() {
        return bedepName;
    }

    public void setBedepName(String bedepName) {
        this.bedepName = bedepName == null ? null : bedepName.trim();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}