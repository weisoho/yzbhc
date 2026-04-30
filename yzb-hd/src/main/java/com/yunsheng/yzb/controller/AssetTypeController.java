package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.AssetMapper;
import com.yunsheng.yzb.mapper.AssetTypeMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetExample;
import com.yunsheng.yzb.model.AssetType;
import com.yunsheng.yzb.model.AssetTypeExample;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.SnGenerateUtil;
import com.yunsheng.yzb.vo.PageOutputDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * 资产类型
 */
@RestController
@RequestMapping("/api/assetType")
public class AssetTypeController {
    @Autowired
    private AssetTypeMapper assetTypeMapper;
    @Autowired
    private AssetMapper assetMapper;

    /**
     * 新增资产类型
     */
    @PostMapping("/addAssetType")
    public AjaxResult<Void> addAssetType(String assetCode , String assetName, String assetDesc, Integer assetState){
        if(assetName == null || assetName.trim().isEmpty()){
            return AjaxResult.res(0,"资产类型名称不能为空",null);
        }
        AssetType assetType = new AssetType();
        assetType.setCdate(new Date());
        assetType.setAssetCode((assetCode == null || assetCode.trim().isEmpty()) ? generateAssetTypeCode() : assetCode);
        assetType.setAssetName(assetName);
        assetType.setAssetDesc(assetDesc);
        assetType.setAssetState(assetState == null ? 1 : assetState);
        assetTypeMapper.insertSelective(assetType);
        return AjaxResult.res(1,"新增成功",null);
    }

    /**
     * 编辑资产类型
     */
    @PostMapping("/updateAssetType")
    public AjaxResult<Void> updateAssetType(Integer id,String assetCode , String assetName, String assetDesc, Integer assetState){
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
     * 资产类型启停用
     */
    @PostMapping("/updateAssetTypeState")
    public AjaxResult<Void> updateAssetTypeState(@RequestParam Integer id, @RequestParam Integer assetState) {
        AssetType assetType = assetTypeMapper.selectByPrimaryKey(id);
        if (assetType == null) {
            return AjaxResult.res(0,"资产类型不存在",null);
        }
        assetType.setAssetState(assetState);
        assetTypeMapper.updateByPrimaryKeySelective(assetType);
        return AjaxResult.res(1,"状态更新成功",null);
    }

    /**
     * 删除资产类型
     */
    @PostMapping("/deleteAssetType")
    public AjaxResult<Void> deleteAssetType(@RequestParam Integer id) {
        AssetType assetType = assetTypeMapper.selectByPrimaryKey(id);
        if (assetType == null) {
            return AjaxResult.res(0,"资产类型不存在",null);
        }

        AssetType fallbackType = findFallbackAssetType(id);
        AssetExample assetExample = new AssetExample();
        assetExample.createCriteria().andAssetTypeidEqualTo(id);
        List<Asset> assets = assetMapper.selectByExample(assetExample);
        for (Asset asset : assets) {
            if (fallbackType != null) {
                asset.setAssetTypeid(fallbackType.getId());
                asset.setAssetTypename(fallbackType.getAssetName());
            } else {
                asset.setAssetTypeid(null);
                asset.setAssetTypename(null);
            }
            asset.setUdate(new Date());
            assetMapper.updateByPrimaryKeySelective(asset);
        }

        assetTypeMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
    }

    /**
     * 资产类型列表
     */
    @PostMapping("/selectAssetType")
    public AjaxResult<PageOutputDto<AssetType>> selectAssetType(String assetCode , String assetName,Integer pageNum,Integer pageSize,Integer assetState){
        PageHelper.startPage(defaultPageNum(pageNum), defaultPageSize(pageSize));
        List<AssetType> list = assetTypeMapper.selectAssetType(assetCode, assetName,assetState);
        PageInfo<AssetType> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    private int defaultPageNum(Integer pageNum) {
        return pageNum == null || pageNum < 1 ? 1 : pageNum;
    }

    private int defaultPageSize(Integer pageSize) {
        return pageSize == null || pageSize < 1 ? 10 : pageSize;
    }

    private String generateAssetTypeCode() {
        AssetTypeExample example = new AssetTypeExample();
        example.setOrderByClause("id desc");
        List<AssetType> list = assetTypeMapper.selectByExample(example);
        String lastCode = list.isEmpty() ? null : list.get(0).getAssetCode();
        return SnGenerateUtil.generate("AT", lastCode);
    }

    private AssetType findFallbackAssetType(Integer excludeId) {
        AssetTypeExample example = new AssetTypeExample();
        example.setOrderByClause("id asc");
        example.createCriteria().andIdNotEqualTo(excludeId).andAssetStateEqualTo(1);
        List<AssetType> list = assetTypeMapper.selectByExample(example);
        return list.isEmpty() ? null : list.get(0);
    }
}
