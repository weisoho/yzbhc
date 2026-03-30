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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
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
        if (model.getAssetId() == null) {
            return AjaxResult.res(0,"请选择资产",null);
        }
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
        model.setCdate(new Date());
        model.setUdate(new Date());
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
        model.setUdate(new Date());
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
        PageHelper.startPage(defaultPageNum(model.getPageNum()), defaultPageSize(model.getPageSize()));
        AssetRepairExample example = new AssetRepairExample();
        AssetRepairExample.Criteria criteria = example.createCriteria().andIdIsNotNull();
        if (model.getRepairCode() != null && !model.getRepairCode().trim().isEmpty()) {
            criteria.andRepairCodeLike(likeValue(model.getRepairCode()));
        }
        if (model.getAssetCode() != null && !model.getAssetCode().trim().isEmpty()) {
            criteria.andAssetCodeLike(likeValue(model.getAssetCode()));
        }
        if (model.getAssetName() != null && !model.getAssetName().trim().isEmpty()) {
            criteria.andAssetNameLike(likeValue(model.getAssetName()));
        }
        if (model.getAssetTypeId() != null) {
            criteria.andAssetTypeIdEqualTo(model.getAssetTypeId());
        }
        if (model.getRepairType() != null) {
            criteria.andRepairTypeEqualTo(model.getRepairType());
        }
        if (model.getRepairStatus() != null) {
            criteria.andRepairStatusEqualTo(model.getRepairStatus());
        }
        if (model.getDepId() != null) {
            criteria.andDepIdEqualTo(model.getDepId());
        }
        if (model.getDate1() != null) {
            criteria.andRepairDateGreaterThanOrEqualTo(model.getDate1());
        }
        if (model.getDate2() != null) {
            criteria.andRepairDateLessThanOrEqualTo(model.getDate2());
        }
        example.setOrderByClause("repair_date desc, id desc");
        List<AssetRepair> list = assetRepairMapper.selectByExample(example);
        PageInfo<AssetRepair> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }

    @PostMapping("/deleteAssetRepair")
    public AjaxResult<Void> deleteAssetRepair(@RequestParam Integer id) {
        AssetRepair repair = assetRepairMapper.selectByPrimaryKey(id);
        if (repair == null) {
            return AjaxResult.res(0,"维修记录不存在",null);
        }
        assetRepairMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
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
