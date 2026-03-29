package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetTransferMapper;
import com.yunsheng.yzb.mapper.AssetTransferRecordMapper;
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
 * 资产调拨
 */
@RestController
@RequestMapping("/api/assetTransfer")
public class AssetTransferController {
    @Autowired
    private AssetTransferMapper assetTransferMapper;
    @Autowired
    private AssetTransferRecordMapper assetTransferRecordMapper;
    /**
     * 新增调拨
     */
    @PostMapping("/addAssetTransfer")
    public AjaxResult addAssetTransfer(@RequestBody AssetTransfer model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        AssetTransferExample assetTransferExample = new AssetTransferExample();
        assetTransferExample.setOrderByClause("id desc");
        List<AssetTransfer> assetTransferList = assetTransferMapper.selectByExample(assetTransferExample);
        String newCode=null;
        if(assetTransferList.size()>0){
            newCode=assetTransferList.get(0).getTransferCode();
        }
        String code = SnGenerateUtil.generate("TR",newCode);
        model.setTransferCode(code);
        model.setDepId(user.getDepId());
        model.setDepName(user.getUserDep());
        model.setUserId(user.getId());
        model.setUserName(user.getUserName());
        assetTransferMapper.insertSelective(model);
        return AjaxResult.res(1,"新增成功",model);

    }

    /**
     * 列表
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        AssetTransferExample assetTransferExample = new AssetTransferExample();
        assetTransferExample.createCriteria().andBedepIdEqualTo(user.getDepId());
        List<AssetTransfer> list = assetTransferMapper.selectByExample(assetTransferExample);
        PageInfo<AssetTransfer> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    /**
     * 调拨确认
     */
    @PostMapping("/confirmTransfer")
    public AjaxResult confirmTransfer(@RequestBody AssetTransferRecord model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        model.setUserId(user.getId());
        model.setUserName(user.getUserName());
        assetTransferRecordMapper.insertSelective(model);
        return AjaxResult.res(1,"成功", model);
    }
}
