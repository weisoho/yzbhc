package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetType;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

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

    /**
     * 资产明细查询
     */
    @PostMapping("/selectAsset")
    public AjaxResult selectAsset(String assetCode , String assetName,Integer pageNum,Integer pageSize,
                                  Integer assetState,Integer depId,Integer assetTypeid, Date purchaseStart, Date purchaseEnd){
        PageHelper.startPage(pageNum, pageSize);
        List<Asset> list = assetMapper.selectAsset(assetCode, assetName,assetState,depId,assetTypeid,purchaseStart,purchaseEnd);
        PageInfo pageInfo = new PageInfo(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }
    /**
     * 导出
     */

    /**
     * 打印
     */
}
