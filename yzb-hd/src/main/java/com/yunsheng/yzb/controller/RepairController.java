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
import com.yunsheng.yzb.vo.RepairVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * 资产维修
 */
@RestController
@RequestMapping("/api")
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
    @GetMapping("/selectRepairList")
    public AjaxResult<PageOutputDto<RepairVo>> selectRepairList(@RequestParam(required = false, defaultValue = "") String assetCode,
                                  @RequestParam(required = false, defaultValue = "") String assetName,
                                  @RequestParam(required = false, defaultValue = "1") Integer pageNum,
                                  @RequestParam(required = false, defaultValue = "10") Integer pageSize,
                                  @RequestParam(required = false) Integer repairType,
                                  @RequestParam(required = false) Integer repairStatus,
                                  @RequestParam(required = false) Integer assetTypeid,
                                  @RequestParam(required = false) String repairStart,
                                  @RequestParam(required = false) String repairEnd){
        PageHelper.startPage(pageNum, pageSize);
        // 日期参数暂时设为null，实际项目中需要根据前端传递的格式进行解析
        List<RepairVo> list = repairMapper.selectRepairList(assetCode, assetName, repairType, repairStatus, assetTypeid, null, null);
        PageInfo<RepairVo> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    /**
     * 删除资产维修记录
     */
    @PostMapping("/deleteRepair")
    public AjaxResult<Void> deleteRepair(@RequestParam Integer id) {
        if (id == null) {
            return AjaxResult.res(0, "id不能为空", null);
        }
        repairMapper.deleteByPrimaryKey(id);
        return AjaxResult.res(1, "删除成功", null);
    }
    

}
