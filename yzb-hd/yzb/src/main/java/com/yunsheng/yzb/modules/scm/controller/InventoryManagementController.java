package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.InventoryTransactionEntity;
import com.yunsheng.yzb.modules.scm.service.InventoryManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 库存管理接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/inventory")
public class InventoryManagementController {

    @Resource
    private InventoryManagementService inventoryManagementService;

    @GetMapping
    public AjaxResult<PageResult<ScmView.InventoryDetail>> page(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryInventory(query));
    }

    @GetMapping("/{inventoryId}")
    public AjaxResult<ScmView.InventoryDetail> detail(@PathVariable Long inventoryId) {
        return AjaxResult.success(inventoryManagementService.getInventoryDetail(inventoryId));
    }

    @PutMapping("/{inventoryId}/adjust")
    public AjaxResult<ScmView.InventoryDetail> adjust(@PathVariable Long inventoryId,
                                                      @Valid @RequestBody ScmRequest.InventoryAdjustSave request) {
        return AjaxResult.success(inventoryManagementService.adjustInventory(inventoryId, request));
    }

    @GetMapping("/transactions")
    public AjaxResult<PageResult<InventoryTransactionEntity>> transactions(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryTransactions(query));
    }
}