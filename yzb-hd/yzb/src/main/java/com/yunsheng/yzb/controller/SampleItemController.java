package com.yunsheng.yzb.controller;

import com.alibaba.excel.EasyExcel;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.SampleItemMapper;
import com.yunsheng.yzb.model.SampleItem;
import com.yunsheng.yzb.model.SampleItemExample;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
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
        if(model.getId()!=null){
            model.setUdate(new  Date());
            sampleItemMapper.updateByPrimaryKey(model);
            return AjaxResult.res(1,"编辑成功",model);
        }else{
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
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        SampleItemExample sampleItemExample = new SampleItemExample();
        //拼接查询sql
        sampleItemExample.createCriteria().andIdIsNotNull().andItemStateEqualTo(model.getItemState()).andItemCodeEqualTo(model.getItemCode()).andItemNameEqualTo(model.getItemName());
        List<SampleItem> list = sampleItemMapper.selectByExample(sampleItemExample);
        PageInfo<SampleItem> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }
    /**
     * 导出
     */
    @PostMapping("/export")
    public AjaxResult exportSampleItem(@RequestBody SampleItem model)  {
        //查询需要的数据
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        SampleItemExample sampleItemExample = new SampleItemExample();
        //拼接查询sql
        sampleItemExample.createCriteria().andIdIsNotNull().andItemStateEqualTo(model.getItemState()).andItemCodeEqualTo(model.getItemCode()).andItemNameEqualTo(model.getItemName());
        List<SampleItem> list = sampleItemMapper.selectByExample(sampleItemExample);
        EasyExcel.write("F:/project/样本项目数据.xls", SampleItem.class).sheet("样本项目").doWrite(list);
        return AjaxResult.res(1,"导出成功，F:/project/样本项目数据.xls",list);
    }



}
