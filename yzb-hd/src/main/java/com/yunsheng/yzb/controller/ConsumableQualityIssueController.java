package com.yunsheng.yzb.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.mapper.ConsumableQualityIssueMapper;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.model.ConsumableQualityIssue;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import com.yunsheng.yzb.utils.SnGenerateUtil;
import com.yunsheng.yzb.vo.PageOutputDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/qualityIssue")
public class ConsumableQualityIssueController {

    @Autowired
    private ConsumableQualityIssueMapper consumableQualityIssueMapper;

    @Autowired
    private InventoryMapper inventoryMapper;

    @PostMapping("/selectModelList")
    public AjaxResult<PageOutputDto<ConsumableQualityIssue>> selectModelList(@RequestBody(required = false) ConsumableQualityIssue model) {
        ConsumableQualityIssue query = model == null ? new ConsumableQualityIssue() : model;
        PageHelper.startPage(query.getPageNum() == null ? 1 : query.getPageNum(), query.getPageSize() == null ? 10 : query.getPageSize());
        List<ConsumableQualityIssue> list = consumableQualityIssueMapper.selectPage(query);
        PageInfo<ConsumableQualityIssue> pageInfo = new PageInfo<>(list);
        return AjaxResult.res(1, "成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }

    @PostMapping("/addOrUpdate")
    public AjaxResult<ConsumableQualityIssue> addOrUpdate(@RequestBody ConsumableQualityIssue model) {
        if (model.getId() == null) {
            return addIssue(model);
        }
        ConsumableQualityIssue current = consumableQualityIssueMapper.selectById(model.getId());
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        current.setOccurrenceDate(model.getOccurrenceDate());
        current.setStatus(model.getStatus() == null ? current.getStatus() : model.getStatus());
        current.setIssueDescription(model.getIssueDescription());
        current.setAttachment(model.getAttachment());
        current.setUpdateTime(LocalDateTime.now());
        consumableQualityIssueMapper.updateEditable(current);
        return AjaxResult.res(1, "修改成功", current);
    }

    @PostMapping("/delete")
    public AjaxResult<Void> delete(@RequestParam Long id) {
        ConsumableQualityIssue current = consumableQualityIssueMapper.selectById(id);
        if (current == null) {
            return AjaxResult.res(0, "记录不存在", null);
        }
        InventoryEntity inventory = inventoryMapper.selectById(current.getInventoryId());
        if (inventory != null) {
            inventory.setCurrentStock((inventory.getCurrentStock() == null ? 0 : inventory.getCurrentStock()) + (current.getQuantity() == null ? 0 : current.getQuantity()));
            inventoryMapper.updateById(inventory);
        }
        current.setUpdateTime(LocalDateTime.now());
        consumableQualityIssueMapper.deleteById(current);
        return AjaxResult.res(1, "删除成功", null);
    }

    private AjaxResult<ConsumableQualityIssue> addIssue(ConsumableQualityIssue model) {
        if (model.getInventoryId() == null) {
            return AjaxResult.res(0, "请选择库存批次", null);
        }
        if (model.getQuantity() == null || model.getQuantity() <= 0) {
            return AjaxResult.res(0, "问题数量必须大于0", null);
        }
        InventoryEntity inventory = inventoryMapper.selectById(model.getInventoryId());
        if (inventory == null) {
            return AjaxResult.res(0, "库存不存在", null);
        }
        if (inventory.getCurrentStock() == null || inventory.getCurrentStock() < model.getQuantity()) {
            return AjaxResult.res(0, "库存不足，无法登记", null);
        }
        YsUser user = LoginCacheUtil.getCurrentAccount();
        ConsumableQualityIssue record = new ConsumableQualityIssue();
        record.setIssueNo(SnGenerateUtil.generate("ZL", consumableQualityIssueMapper.selectLatestNo()));
        record.setInventoryId(inventory.getId());
        record.setMaterialId(inventory.getMaterialId());
        record.setMaterialCode(inventory.getMaterialCode());
        record.setMaterialName(inventory.getMaterialName());
        record.setSpecification(inventory.getSpecification());
        record.setModel(inventory.getModel());
        record.setRegistrationNumber(inventory.getRegistrationNumber());
        record.setManufacturer(inventory.getManufacturer());
        record.setSupplierName(inventory.getSupplier());
        record.setBatchNumber(inventory.getBatchNumber());
        record.setProductionDate(inventory.getProductionDate());
        record.setExpiryDate(inventory.getExpiryDate());
        record.setQuantity(model.getQuantity());
        record.setOccurrenceDate(model.getOccurrenceDate() == null ? LocalDateTime.now() : model.getOccurrenceDate());
        record.setStatus(model.getStatus() == null ? 1 : model.getStatus());
        record.setIssueDescription(model.getIssueDescription());
        record.setAttachment(model.getAttachment());
        record.setCreatorId(user == null ? null : user.getId());
        record.setCreatorName(user == null ? null : (StringUtils.hasText(user.getRealName()) ? user.getRealName() : user.getUserName()));
        record.setCreateTime(LocalDateTime.now());
        record.setUpdateTime(LocalDateTime.now());
        record.setDeleteFlag(0);
        consumableQualityIssueMapper.insert(record);

        inventory.setCurrentStock(inventory.getCurrentStock() - model.getQuantity());
        inventoryMapper.updateById(inventory);
        return AjaxResult.res(1, "登记成功", record);
    }
}