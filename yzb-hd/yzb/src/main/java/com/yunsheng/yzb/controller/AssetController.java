package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.mapper.AssetMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * 资产
 */
@RestController
@RequestMapping("/yzb")
public class AssetController {
    @Autowired
    private AssetMapper assetMapper;

    /**
     * 新增资产
     */
    @PostMapping("/addAsset")
    public AjaxResult addAsset(@RequestBody Asset asset){
        asset.setCdate(new Date());
        asset.setUdate(new Date());
        assetMapper.insertSelective(asset);
        return AjaxResult.res(1,"新增成功",asset);
    }

    /**
     * 编辑资产
     */
    @PostMapping("/updateAsset")
    public AjaxResult updateAsset(@RequestBody Asset asset){
        asset.setUdate(new Date());
        assetMapper.updateByPrimaryKeySelective(asset);
        return AjaxResult.res(1,"修改成功",asset);
    }
}
