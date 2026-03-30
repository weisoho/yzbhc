package com.yunsheng.yzb.model;

import java.util.Date;

public class Asset {
    /**
     * id
     */
    private Integer id;

    /**
     * 资产编码
     */
    private String assetCode;

    /**
     * 资产名字
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
     * 生产厂商
     */
    private String manufacturer;

    /**
     * 购置日期
     */
    private Date purchaseDate;

    /**
     * 原值
     */
    private String origValue;

    /**
     * 年限
     */
    private String serviceLife;

    /**
     * 使用部门id
     */
    private Integer depId;

    /**
     * 使用部门名称
     */
    private String depName;

    /**
     * 存放地点
     */
    private String stoLocation;

    /**
     * 责任人
     */
    private String respPerson;

    /**
     * 资产状态1再用2闲置3维修4待报废
     */
    private Integer assetState;

    /**
     * 折旧方法1直线法2双倍余额递减法3年数总和法
     */
    private Integer deprMethod;

    /**
     * 序列号
     */
    private String serialNum;

    /**
     * 资产描述
     */
    private String assetDesc;

    /**
     * 附件
     */
    private String attachment;

    /**
     * 仓库id
     */
    private Integer inventoryId;

    /**
     * 创建时间
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

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer == null ? null : manufacturer.trim();
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getOrigValue() {
        return origValue;
    }

    public void setOrigValue(String origValue) {
        this.origValue = origValue == null ? null : origValue.trim();
    }

    public String getServiceLife() {
        return serviceLife;
    }

    public void setServiceLife(String serviceLife) {
        this.serviceLife = serviceLife == null ? null : serviceLife.trim();
    }

    public Integer getDepId() {
        return depId;
    }

    public void setDepId(Integer depId) {
        this.depId = depId;
    }

    public String getDepName() {
        return depName;
    }

    public void setDepName(String depName) {
        this.depName = depName == null ? null : depName.trim();
    }

    public String getStoLocation() {
        return stoLocation;
    }

    public void setStoLocation(String stoLocation) {
        this.stoLocation = stoLocation == null ? null : stoLocation.trim();
    }

    public String getRespPerson() {
        return respPerson;
    }

    public void setRespPerson(String respPerson) {
        this.respPerson = respPerson == null ? null : respPerson.trim();
    }

    public Integer getAssetState() {
        return assetState;
    }

    public void setAssetState(Integer assetState) {
        this.assetState = assetState;
    }

    public Integer getDeprMethod() {
        return deprMethod;
    }

    public void setDeprMethod(Integer deprMethod) {
        this.deprMethod = deprMethod;
    }

    public String getSerialNum() {
        return serialNum;
    }

    public void setSerialNum(String serialNum) {
        this.serialNum = serialNum == null ? null : serialNum.trim();
    }

    public String getAssetDesc() {
        return assetDesc;
    }

    public void setAssetDesc(String assetDesc) {
        this.assetDesc = assetDesc == null ? null : assetDesc.trim();
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment == null ? null : attachment.trim();
    }

    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Integer inventoryId) {
        this.inventoryId = inventoryId;
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