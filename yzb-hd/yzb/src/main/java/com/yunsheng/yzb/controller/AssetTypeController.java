package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetTypeMapper;
import com.yunsheng.yzb.model.AssetType;
import com.yunsheng.yzb.model.Warehouse;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * 资产类型
 */
@RestController
@RequestMapping("/yzb")
public class AssetTypeController {
    @Autowired
    private AssetTypeMapper assetTypeMapper;

    /**
     * 新增资产类型
     */
    @PostMapping("/addAssetType")
    public AjaxResult addAssetType(String assetCode , String assetName, String assetDesc, Integer assetState){
        AssetType assetType = new AssetType();
        assetType.setCdate(new Date());
        assetType.setAssetCode(assetCode);
        assetType.setAssetName(assetName);
        assetType.setAssetDesc(assetDesc);
        assetType.setAssetState(assetState);
        assetTypeMapper.insert(assetType);
        return AjaxResult.res(1,"新增成功",null);
    }

    /**
     * 编辑资产类型
     */
    @PostMapping("/updateAssetType")
    public AjaxResult updateAssetType(Integer id,String assetCode , String assetName, String assetDesc, Integer assetState){
        AssetType assetType = assetTypeMapper.selectByPrimaryKey(id);
        if(assetType==null){
            return AjaxResult.res(0,"id错误",null);
        }
        assetType.setAssetCode(assetCode);
        assetType.setAssetName(assetName);
        assetType.setAssetDesc(assetDesc);
        assetType.setAssetState(assetState);
        assetTypeMapper.updateByPrimaryKeySelective(assetType);
        return AjaxResult.res(1,"编辑成功",null);
    }

    /**
     * 资产类型列表
     */
    @PostMapping("/selectAssetType")
    public AjaxResult selectAssetType(String assetCode , String assetName,Integer pageNum,Integer pageSize,Integer assetState){
        PageHelper.startPage(pageNum, pageSize);
        List<AssetType> warehouseList = assetTypeMapper.selectAssetType(assetCode, assetName,assetState);
        PageInfo pageInfo = new PageInfo(warehouseList);
        return AjaxResult.res(1,"删除成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }
}
