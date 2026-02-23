package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.WarehouseMapper;
import com.yunsheng.yzb.model.Warehouse;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 仓库管理模块
 */
@RestController
@RequestMapping("/yzb")
public class WarehouseController {
    @Autowired
    private WarehouseMapper warehouseMapper;
    /**
     * 新增仓库
     */
    @PostMapping("/addWarehouse")
    public AjaxResult addWarehouse(String capacity , String wareName,String position,String chargePerson){
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
    public AjaxResult delWarehouse(Integer id){
        warehouseMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1,"删除成功",null);
    }

    /**
     * 查询仓库列表
     */
    @PostMapping("/selectWarehouse")
    public AjaxResult selectWarehouse(String wareName,String position,Integer pageNum,Integer pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Warehouse> warehouseList = warehouseMapper.selectWarehouse(wareName, position);
        PageInfo pageInfo = new PageInfo(warehouseList);
        return AjaxResult.res(1,"删除成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @GetMapping("/test")
    public String test(){
        return "测试";
    }
}
