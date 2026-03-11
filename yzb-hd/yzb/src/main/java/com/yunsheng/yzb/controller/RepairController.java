package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.RepairMapper;
import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetType;
import com.yunsheng.yzb.model.Repair;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.vo.PageOutputDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * 资产维修
 */
@RestController
@RequestMapping("/yzb")
public class RepairController {
    @Autowired
    private RepairMapper repairMapper;
    /**
     * 新增资产维修
     */
    @PostMapping("/addRepair")
    public AjaxResult<Void> addRepair(@RequestBody Repair model){
        model.setCdate(new Date());
        model.setUdate(new Date());
        repairMapper.insert(model);
        return AjaxResult.res(1,"新增成功",null);
    }

    /**
     * 修改资产维修
     */
    @PostMapping("/updateRepair")
    public AjaxResult<Void> updateRepair(@RequestBody Repair model){
        model.setUdate(new Date());
        repairMapper.updateByPrimaryKeySelective(model);
        return AjaxResult.res(1,"修改成功",null);
    }

    /**
     * 查询资产维修列表
     */
    @PostMapping("/selectRepairList")
    public AjaxResult<PageOutputDto<Repair>> selectRepairList(String assetCode , String assetName,Integer pageNum,Integer pageSize,
                                  Integer repairType,Integer repairStatus, Integer assetTypeid,Date repairStart, Date repairEnd){
        PageHelper.startPage(pageNum, pageSize);
        List<Repair> list = repairMapper.selectRepairList(assetCode, assetName,repairType,repairStatus,assetTypeid,repairStart,repairEnd);
        PageInfo<Repair> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }
}
