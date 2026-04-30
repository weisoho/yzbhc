package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.WarehouseMapper;
import com.yunsheng.yzb.model.Warehouse;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.vo.PageOutputDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 仓库管理模块
 */
@RestController
@RequestMapping("/api")
public class WarehouseController {
    @Autowired
    private WarehouseMapper warehouseMapper;
    /**
     * 新增仓库
     */
    @PostMapping("/addWarehouse")
    public AjaxResult<Void> addWarehouse(String capacity , String wareName,String position,String chargePerson){
        Warehouse warehouse = new Warehouse();
        warehouse.setCdate(new Date());
        warehouse.setCapacity(capacity);
        warehouse.setPosition(position);
        warehouse.setChargePerson(chargePerson);
        warehouse.setWareName(wareName);
        warehouseMapper.insert(warehouse);
        return AjaxResult.res(1,"新增成功",null);
    }

    /**
     * 删除仓库
     */
    @PostMapping("/delWarehouse")
    public AjaxResult<Void> delWarehouse(Integer id){
        warehouseMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
    }

    /**
     * 编辑仓库
     */
    @PostMapping("/updateWarehouse")
    public AjaxResult<Void> updateWarehouse(Integer id,String capacity , String wareName,String position,String chargePerson){
        Warehouse warehouse = warehouseMapper.selectByPrimaryKey(id);
        if(warehouse==null){
            return AjaxResult.res(0,"id错误",null);
        }
        //warehouse.setCdate(new Date());
        warehouse.setCapacity(capacity);
        warehouse.setPosition(position);
        warehouse.setChargePerson(chargePerson);
        warehouse.setWareName(wareName);
        warehouseMapper.updateByPrimaryKeySelective(warehouse);
        return AjaxResult.res(1,"编辑成功",null);
    }

    /**
     * 查询仓库列表
     */
    @PostMapping("/selectWarehouse")
    public AjaxResult<PageOutputDto<Warehouse>> selectWarehouse(String wareName,String position,Integer pageNum,Integer pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Warehouse> warehouseList = warehouseMapper.selectWarehouse(wareName, position);
        PageInfo<Warehouse> pageInfo = new PageInfo<>(warehouseList);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @GetMapping("/test")
    public String test(){
        YsUser ysUser = LoginCacheUtil.getCurrentAccount();
        return ysUser.toString();
    }
}
