package com.yunsheng.yzb.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.common.ScmCodeGenerator;
import com.yunsheng.yzb.mapper.CheckInventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.model.*;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.vo.CheckInventoryVo;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 盘点
 */
@RestController
@RequestMapping("/api/checkInventory")
public class CheckInventoryController {
    @Autowired
    private InventoryMapper inventoryMapper;
    @Autowired
    private CheckInventoryMapper checkInventoryMapper;
    /**
     * 生成盘点
     */
    @PostMapping("/addCheckInventory")
    public AjaxResult addCheckInventory(@RequestBody CheckInventory model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        InventoryEntity inventoryEntity = inventoryMapper.selectById(model.getInventoryId());
        model.setInventoryId(Integer.valueOf(inventoryEntity.getId()+""));//转化数据格式
        model.setCdate(new Date());
        model.setUdate(new Date());
        model.setUserId(user.getId());
        model.setUserName(user.getUserName());
        model.setDepId(user.getDepId());
        model.setDepName(user.getUserDep());
        model.setSysNum(inventoryEntity.getCurrentStock());
        //String nextCode = ScmCodeGenerator.nextCode(checkInventoryMapper, "PD", "che_code");
        model.setCheCode(model.getCheCode());
        checkInventoryMapper.insertSelective(model);
        return AjaxResult.res(1,"新增成功",model);
    }
    /**
     * 盘点列表
     * model.getStatus()=0.盘点表。
     * model.getStatus()=2.盘点历史记录表。
     */
    @PostMapping("/selectModelList")
    public AjaxResult selectModelList(@RequestBody CheckInventory model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        CheckInventoryExample example = new CheckInventoryExample();
        //只可以盘他自己的科室部门
        example.createCriteria().andStatusEqualTo(model.getStatus()).andDepIdEqualTo(user.getDepId());
        List<CheckInventory> list = checkInventoryMapper.selectByExample(example);
        PageInfo<CheckInventory> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    /**
     * 明细列表
     */
    @PostMapping("/selectModelMXList")
    public AjaxResult selectModelMXList(@RequestBody InventoryEntity model, ScmRequest.InventoryQuery query){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        //查所有的仓库
        CheckInventoryExample example = new CheckInventoryExample();
        example.createCriteria().andStatusEqualTo(0).andDepIdEqualTo(user.getDepId());
        List<CheckInventory> list = checkInventoryMapper.selectByExample(example);
        List<Integer> listint =new ArrayList<>();
        if(list.size()>0){
            for (CheckInventory checkInventory : list) {
                listint.add(checkInventory.getInventoryId());
            }
        }
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
        LambdaQueryWrapper<InventoryEntity> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(true,InventoryEntity::getId,listint)
                .like(StringUtils.hasText(query.getMaterialCode()), InventoryEntity::getMaterialCode, query.getMaterialCode())
                .like(StringUtils.hasText(query.getMaterialName()), InventoryEntity::getMaterialName, query.getMaterialName())
                .like(StringUtils.hasText(query.getSupplier()), InventoryEntity::getSupplier, query.getSupplier())
                .like(StringUtils.hasText(query.getManufacturer()), InventoryEntity::getManufacturer, query.getManufacturer())
                .like(StringUtils.hasText(query.getWarehouse()), InventoryEntity::getWarehouse, query.getWarehouse())
                .like(StringUtils.hasText(query.getBatchNumber()), InventoryEntity::getBatchNumber, query.getBatchNumber());
        inventoryMapper.selectList(wrapper);
        PageInfo<CheckInventory> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    /**
     * 盘点按钮
     * @param model
     * @return
     */
    @PostMapping("/Checknow")
    public AjaxResult Checknow(@RequestBody CheckInventory model){
        //查询通过仓库id
        Integer inventoryId = model.getInventoryId();
        CheckInventoryExample example = new CheckInventoryExample();
        example.createCriteria().andInventoryIdEqualTo(inventoryId);
        List<CheckInventory> checkInventoryList = checkInventoryMapper.selectByExample(example);
        CheckInventory inventory = checkInventoryList.get(0);
        inventory.setActualNum(model.getActualNum());
        inventory.setUdate(new Date());
        if(model.getActualNum()>inventory.getSysNum()){
            //盈利
            inventory.setCheStatus(2);
        }
        if(model.getActualNum()<inventory.getSysNum()){
            //亏
            inventory.setCheStatus(1);
        }
        if(model.getActualNum()==inventory.getSysNum()){
            //无差异
            inventory.setCheStatus(0);
        }
        inventory.setDiffReason(model.getDiffReason());//差异原因
        checkInventoryMapper.updateByPrimaryKeySelective(inventory);
        return AjaxResult.res(1,"盘点成功",model);
    }

    /**
     * 盘点顺义露露
     */
    @PostMapping("/selectpdxyModelList")
    public AjaxResult selectpdxyModelList(@RequestBody CheckInventory model){
        YsUser user = LoginCacheUtil.getCurrentAccount();//获取当前登录人信息
        PageHelper.startPage(model.getPageNum(), model.getPageSize());
       //链表查询
        List<CheckInventoryVo> list = checkInventoryMapper.selectpdxyModelList();
        PageInfo<CheckInventoryVo> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @PostMapping("/reCheck")
    public AjaxResult reCheck(@RequestBody CheckInventory model){
        CheckInventory checkInventory = checkInventoryMapper.selectByPrimaryKey(model.getId());
        checkInventory.setStatus(2);
        checkInventory.setUdate(new Date());
        checkInventoryMapper.updateByPrimaryKeySelective(checkInventory);
        return AjaxResult.res(1,"确认成功",null);
    }
}
