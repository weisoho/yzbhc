package com.yunsheng.yzb.controller;

import com.alibaba.excel.EasyExcel;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.SampleItemMapper;
import com.yunsheng.yzb.model.SampleItem;
import com.yunsheng.yzb.model.SampleItemExample;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.SnGenerateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * 样本-项目管理
 */
@RestController
@RequestMapping("/api/sampleItem")
public class SampleItemController {
    @Autowired
    private SampleItemMapper sampleItemMapper;
    /**
     * 新增,编辑项目
     */
    @PostMapping("/addorupdateSampleItem")
    public AjaxResult addSampleItem(@RequestBody SampleItem model){
        if (model.getItemName() == null || model.getItemName().trim().isEmpty()) {
            return AjaxResult.res(0,"项目名称不能为空",null);
        }
        if ((model.getIsCharge() != null && model.getIsCharge() == 1)
                && (model.getChargeCode() == null || model.getChargeCode().trim().isEmpty())) {
            return AjaxResult.res(0,"收费项目必须填写收费编码",null);
        }
        if(model.getId()!=null){
            model.setUdate(new  Date());
            sampleItemMapper.updateByPrimaryKeySelective(model);
            return AjaxResult.res(1,"编辑成功",model);
        }else{
            if (model.getItemCode() == null || model.getItemCode().trim().isEmpty()) {
                model.setItemCode(generateItemCode());
            }
            model.setCdate(new Date());
            model.setUdate(new Date());
            sampleItemMapper.insertSelective(model);
            return AjaxResult.res(1,"新增成功",model);
        }

    }

    /**
     * 项目列表
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(@RequestBody SampleItem model){
        PageHelper.startPage(defaultPageNum(model.getPageNum()), defaultPageSize(model.getPageSize()));
        SampleItemExample sampleItemExample = new SampleItemExample();
        SampleItemExample.Criteria criteria = sampleItemExample.createCriteria().andIdIsNotNull();
        if (model.getItemState() != null) {
            criteria.andItemStateEqualTo(model.getItemState());
        }
        if (model.getDepId() != null) {
            criteria.andDepIdEqualTo(model.getDepId());
        }
        if (model.getItemCode() != null && !model.getItemCode().trim().isEmpty()) {
            criteria.andItemCodeLike(likeValue(model.getItemCode()));
        }
        if (model.getItemName() != null && !model.getItemName().trim().isEmpty()) {
            criteria.andItemNameLike(likeValue(model.getItemName()));
        }
        sampleItemExample.setOrderByClause("id desc");
        List<SampleItem> list = sampleItemMapper.selectByExample(sampleItemExample);
        PageInfo<SampleItem> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }

    /**
     * 删除项目
     */
    @PostMapping("/deleteSampleItem")
    public AjaxResult<Void> deleteSampleItem(@RequestParam Integer id) {
        SampleItem sampleItem = sampleItemMapper.selectByPrimaryKey(id);
        if (sampleItem == null) {
            return AjaxResult.res(0,"项目不存在",null);
        }
        sampleItemMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
    }

    /**
     * 启停用项目
     */
    @PostMapping("/updateItemState")
    public AjaxResult<SampleItem> updateItemState(@RequestParam Integer id, @RequestParam Integer itemState) {
        SampleItem sampleItem = sampleItemMapper.selectByPrimaryKey(id);
        if (sampleItem == null) {
            return AjaxResult.res(0,"项目不存在",null);
        }
        sampleItem.setItemState(itemState);
        sampleItem.setUdate(new Date());
        sampleItemMapper.updateByPrimaryKeySelective(sampleItem);
        return AjaxResult.res(1,"状态更新成功",sampleItem);
    }
    /**
     * 导出
     */
    @PostMapping("/export")
    public AjaxResult exportSampleItem(@RequestBody SampleItem model)  {
        SampleItemExample sampleItemExample = new SampleItemExample();
        SampleItemExample.Criteria criteria = sampleItemExample.createCriteria().andIdIsNotNull();
        if (model.getItemState() != null) {
            criteria.andItemStateEqualTo(model.getItemState());
        }
        if (model.getDepId() != null) {
            criteria.andDepIdEqualTo(model.getDepId());
        }
        if (model.getItemCode() != null && !model.getItemCode().trim().isEmpty()) {
            criteria.andItemCodeLike(likeValue(model.getItemCode()));
        }
        if (model.getItemName() != null && !model.getItemName().trim().isEmpty()) {
            criteria.andItemNameLike(likeValue(model.getItemName()));
        }
        sampleItemExample.setOrderByClause("id desc");
        List<SampleItem> list = sampleItemMapper.selectByExample(sampleItemExample);
        EasyExcel.write("F:/project/样本项目数据.xls", SampleItem.class).sheet("样本项目").doWrite(list);
        return AjaxResult.res(1,"导出成功，F:/project/样本项目数据.xls",list);
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

    private String generateItemCode() {
        SampleItemExample example = new SampleItemExample();
        example.setOrderByClause("id desc");
        List<SampleItem> list = sampleItemMapper.selectByExample(example);
        String lastCode = list.isEmpty() ? null : list.get(0).getItemCode();
        return SnGenerateUtil.generate("SI", lastCode);
    }



}
