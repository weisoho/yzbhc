package com.yunsheng.yzb.controller;

import com.alibaba.excel.EasyExcel;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.SampleManMapper;
import com.yunsheng.yzb.model.*;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * 样本-样本量管理
 */
@RestController
@RequestMapping("/api/sampleMan")
public class SampleManController {
    @Autowired
    private SampleManMapper sampleManMapper;
    /**
     * 新增,编辑样本量管理
     */
    @PostMapping("/addorupdateSampleMan")
    public AjaxResult addOrUpdateSampleMan(@RequestBody SampleMan model){
        //获取操作人
        YsUser ysUser = LoginCacheUtil.getCurrentAccount();
        model.setDepId(ysUser.getDepId());
        model.setDepName(ysUser.getUserDep());
        model.setUserId(ysUser.getId());
        model.setUserName(ysUser.getUserName());
        if(model.getId()!=null){
            model.setUdate(new Date());
            sampleManMapper.updateByPrimaryKey(model);
            return AjaxResult.res(1,"编辑成功",model);
        }else{
            model.setCdate(new Date());
            model.setUdate(new Date());
            sampleManMapper.insertSelective(model);
            return AjaxResult.res(1,"新增成功",model);
        }

    }

    /**
     * 列表
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(@RequestBody SampleMan model){
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        SampleManExample example = new SampleManExample();
        //拼接查询sql
        example.createCriteria().andIdIsNotNull().andDepIdEqualTo(model.getDepId()).andSampleDateBetween(model.getSdate(),model.getEdate());
        List<SampleMan> list = sampleManMapper.selectByExample(example);
        PageInfo<SampleMan> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }

    /**
     * 导出
     */

    @PostMapping("/export")
    public AjaxResult export(@RequestBody SampleMan model) {
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        SampleManExample example = new SampleManExample();
        //拼接查询sql
        example.createCriteria().andIdIsNotNull().andDepIdEqualTo(model.getDepId()).andSampleDateBetween(model.getSdate(), model.getEdate());
        List<SampleMan> list = sampleManMapper.selectByExample(example);
        EasyExcel.write("F:/project/样本量数据.xls", SampleMan.class).sheet("样本量").doWrite(list);
        return AjaxResult.res(1,"导出成功，F:/project/样本项目数据.xls",list);
    }
}
