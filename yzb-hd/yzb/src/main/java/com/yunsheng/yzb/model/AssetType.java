package com.yunsheng.yzb.model;

import java.util.Date;

public class AssetType {
    /**
     * id
     */
    private Integer id;

    /**
     * 资产类型编码
     */
    private String assetCode;

    /**
     * 资产类型名称
     */
    private String assetName;

    /**
     * 资产类型描述
     */
    private String assetDesc;

    /**
     * 创建时间
     */
    private Date cdate;

    /**
     * 1启用0停用
     */
    private Integer assetState;

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

    public String getAssetDesc() {
        return assetDesc;
    }

    public void setAssetDesc(String assetDesc) {
        this.assetDesc = assetDesc == null ? null : assetDesc.trim();
    }

    public Date getCdate() {
        return cdate;
    }

    public void setCdate(Date cdate) {
        this.cdate = cdate;
    }

    public Integer getAssetState() {
        return assetState;
    }

    public void setAssetState(Integer assetState) {
        this.assetState = assetState;
    }
}