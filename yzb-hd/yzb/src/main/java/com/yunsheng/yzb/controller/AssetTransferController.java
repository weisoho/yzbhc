package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetMapper;
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

import java.util.Date;
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
    @Autowired
    private AssetMapper assetMapper;
    /**
     * 新增调拨
     */
    @PostMapping("/addAssetTransfer")
    public AjaxResult addAssetTransfer(@RequestBody AssetTransfer model){
        if (model.getAssetId() == null || model.getBedepId() == null) {
            return AjaxResult.res(0,"请选择资产和接收部门",null);
        }
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
        model.setStatus(model.getStatus() == null ? 1 : model.getStatus());
        model.setCdate(new Date());
        model.setUdate(new Date());
        assetTransferMapper.insertSelective(model);

        Asset asset = assetMapper.selectByPrimaryKey(model.getAssetId());
        if (asset != null) {
            asset.setAssetState(2);
            asset.setUdate(new Date());
            assetMapper.updateByPrimaryKeySelective(asset);
        }
        return AjaxResult.res(1,"新增成功",model);

    }

    /**
     * 列表
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(@RequestBody(required = false) AssetTransfer model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        AssetTransferExample assetTransferExample = new AssetTransferExample();
        AssetTransferExample.Criteria criteria = assetTransferExample.createCriteria().andBedepIdEqualTo(user.getDepId());
        if (model != null) {
            if (model.getStatus() != null) {
                criteria.andStatusEqualTo(model.getStatus());
            }
            if (model.getAssetCode() != null && !model.getAssetCode().trim().isEmpty()) {
                criteria.andAssetCodeLike(likeValue(model.getAssetCode()));
            }
            if (model.getAssetName() != null && !model.getAssetName().trim().isEmpty()) {
                criteria.andAssetNameLike(likeValue(model.getAssetName()));
            }
            PageHelper.startPage(defaultPageNum(model.getPageNum()), defaultPageSize(model.getPageSize()));
        } else {
            PageHelper.startPage(1, 10);
        }
        assetTransferExample.setOrderByClause("id desc");
        List<AssetTransfer> list = assetTransferMapper.selectByExample(assetTransferExample);
        PageInfo<AssetTransfer> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    /**
     * 调拨确认
     */
    @PostMapping("/confirmTransfer")
    public AjaxResult confirmTransfer(@RequestBody AssetTransferRecord model){
        if (model.getTransferId() == null || model.getStatus() == null) {
            return AjaxResult.res(0,"缺少调拨记录或确认状态",null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        AssetTransfer transfer = assetTransferMapper.selectByPrimaryKey(model.getTransferId());
        if (transfer == null) {
            return AjaxResult.res(0,"调拨单不存在",null);
        }
        model.setUserId(user.getId());
        model.setUserName(user.getUserName());
        model.setCdate(new Date());
        model.setUdate(new Date());
        assetTransferRecordMapper.insertSelective(model);

        transfer.setStatus(model.getStatus() == 1 ? 2 : 3);
        transfer.setUdate(new Date());
        assetTransferMapper.updateByPrimaryKeySelective(transfer);

        if (model.getStatus() == 1) {
            Asset asset = assetMapper.selectByPrimaryKey(transfer.getAssetId());
            if (asset != null) {
                asset.setDepId(transfer.getBedepId());
                asset.setDepName(transfer.getBedepName());
                asset.setRespPerson(model.getRespPersion());
                asset.setInventoryId(model.getInventoryId());
                asset.setAssetState(model.getAssetStatus() != null && model.getAssetStatus() >= 3 ? 3 : 1);
                asset.setUdate(new Date());
                assetMapper.updateByPrimaryKeySelective(asset);
            }
        }
        return AjaxResult.res(1,"成功", model);
    }

    private int defaultPageNum(Integer pageNum) {
        return pageNum == null || pageNum < 1 ? 1 : pageNum;
    }

    private int defaultPageSize(Integer pageSize) {
        return pageSize == null || pageSize < 1 ? 10 : pageSize;
    }

    private String likeValue(String value) {
        return "%" + value.trim() + "%";
    }
}
