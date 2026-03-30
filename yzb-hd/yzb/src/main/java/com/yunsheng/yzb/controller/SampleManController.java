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
import org.springframework.web.bind.annotation.RequestParam;
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
        if (model.getSampleDate() == null) {
            return AjaxResult.res(0,"日期不能为空",null);
        }
        if (model.getItemId() == null) {
            return AjaxResult.res(0,"项目不能为空",null);
        }
        //获取操作人
        YsUser ysUser = LoginCacheUtil.getCurrentAccount();
        model.setDepId(ysUser.getDepId());
        model.setDepName(ysUser.getUserDep());
        model.setUserId(ysUser.getId());
        model.setUserName(ysUser.getUserName());
        if(model.getId()!=null){
            SampleMan existing = sampleManMapper.selectByPrimaryKey(model.getId());
            if (existing == null) {
                return AjaxResult.res(0,"记录不存在",null);
            }
            if (!isSameDay(existing.getSampleDate(), new Date())) {
                return AjaxResult.res(0,"仅允许修改当天记录",null);
            }
            if (!ysUser.getId().equals(existing.getUserId())) {
                return AjaxResult.res(0,"仅允许修改本人提交的当天记录",null);
            }
            model.setUdate(new Date());
            sampleManMapper.updateByPrimaryKeySelective(model);
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
        PageHelper.startPage(defaultPageNum(model.getPageNum()), defaultPageSize(model.getPageSize()));
        SampleManExample example = new SampleManExample();
        SampleManExample.Criteria criteria = example.createCriteria().andIdIsNotNull();
        if (model.getDepId() != null) {
            criteria.andDepIdEqualTo(model.getDepId());
        }
        if (model.getItemId() != null) {
            criteria.andItemIdEqualTo(model.getItemId());
        }
        if (model.getItemName() != null && !model.getItemName().trim().isEmpty()) {
            criteria.andItemNameLike(likeValue(model.getItemName()));
        }
        if (model.getSdate() != null) {
            criteria.andSampleDateGreaterThanOrEqualTo(model.getSdate());
        }
        if (model.getEdate() != null) {
            criteria.andSampleDateLessThanOrEqualTo(model.getEdate());
        }
        example.setOrderByClause("sample_date desc, id desc");
        List<SampleMan> list = sampleManMapper.selectByExample(example);
        PageInfo<SampleMan> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));

    }

    /**
     * 删除样本记录
     */
    @PostMapping("/deleteSampleMan")
    public AjaxResult<Void> deleteSampleMan(@RequestParam Integer id) {
        SampleMan sampleMan = sampleManMapper.selectByPrimaryKey(id);
        if (sampleMan == null) {
            return AjaxResult.res(0,"记录不存在",null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        if (!isSameDay(sampleMan.getSampleDate(), new Date())) {
            return AjaxResult.res(0,"仅允许删除当天记录",null);
        }
        if (!user.getId().equals(sampleMan.getUserId())) {
            return AjaxResult.res(0,"仅允许删除本人提交的当天记录",null);
        }
        sampleManMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
    }

    /**
     * 导出
     */

    @PostMapping("/export")
    public AjaxResult export(@RequestBody SampleMan model) {
        SampleManExample example = new SampleManExample();
        SampleManExample.Criteria criteria = example.createCriteria().andIdIsNotNull();
        if (model.getDepId() != null) {
            criteria.andDepIdEqualTo(model.getDepId());
        }
        if (model.getItemId() != null) {
            criteria.andItemIdEqualTo(model.getItemId());
        }
        if (model.getItemName() != null && !model.getItemName().trim().isEmpty()) {
            criteria.andItemNameLike(likeValue(model.getItemName()));
        }
        if (model.getSdate() != null) {
            criteria.andSampleDateGreaterThanOrEqualTo(model.getSdate());
        }
        if (model.getEdate() != null) {
            criteria.andSampleDateLessThanOrEqualTo(model.getEdate());
        }
        example.setOrderByClause("sample_date desc, id desc");
        List<SampleMan> list = sampleManMapper.selectByExample(example);
        EasyExcel.write("F:/project/样本量数据.xls", SampleMan.class).sheet("样本量").doWrite(list);
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

    private boolean isSameDay(Date source, Date target) {
        if (source == null || target == null) {
            return false;
        }
        return source.getYear() == target.getYear()
                && source.getMonth() == target.getMonth()
                && source.getDate() == target.getDate();
    }
}
