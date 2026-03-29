package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetRepairMapper;
import com.yunsheng.yzb.model.*;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.utils.SnGenerateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 资产维修
 */
@RestController
@RequestMapping("/api/assetRepair")
public class AssetRepairController {
    @Autowired
    private AssetRepairMapper assetRepairMapper;

    /**
     * 新增资产维修
     * @param model
     * @return
     */
    @PostMapping("/addAssetRepair")
    public AjaxResult addAssetRepair(@RequestBody AssetRepair model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        AssetRepairExample assetRepairExample = new AssetRepairExample();
        assetRepairExample.setOrderByClause("id desc");
        List<AssetRepair> assetRepairList = assetRepairMapper.selectByExample(assetRepairExample);
        String newCode=null;
        if(assetRepairList.size()>0){
            newCode=assetRepairList.get(0).getRepairCode();
        }
        String code = SnGenerateUtil.generate("MR",newCode);
        model.setRepairCode(code);
        model.setDepId(user.getDepId());
        model.setUserId(user.getId());
        assetRepairMapper.insertSelective(model);
        return AjaxResult.res(1,"新增成功",model);

    }
    /**
     * 编辑资产维修
     * @param model
     * @return
     */
    @PostMapping("/updateAssetRepair")
    public AjaxResult updateAssetRepair(@RequestBody AssetRepair model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        model.setDepId(user.getDepId());
        model.setUserId(user.getId());
        assetRepairMapper.updateByPrimaryKeySelective(model);
        return AjaxResult.res(1,"编辑成功",model);
    }

    /**
     * 维修资产列表
     * @param model
     * @return
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(@RequestBody AssetRepair model){
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        AssetRepairExample example = new AssetRepairExample();
        example.createCriteria().andIdIsNotNull()
        .andRepairCodeEqualTo(model.getRepairCode())
        .andAssetCodeEqualTo(model.getAssetCode())
        .andAssetNameEqualTo(model.getAssetName())
        .andAssetTypeIdEqualTo(model.getAssetTypeId())
        .andRepairTypeEqualTo(model.getRepairType())
        .andRepairStatusEqualTo(model.getRepairStatus())
        .andRepairDateBetween(model.getDate1(),model.getDate2());
        List<AssetRepair> list = assetRepairMapper.selectByExample(example);
        PageInfo<AssetRepair> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }
}
