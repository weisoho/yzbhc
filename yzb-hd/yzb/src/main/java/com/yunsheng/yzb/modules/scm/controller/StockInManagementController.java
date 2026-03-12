package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.StockInOrderEntity;
import com.yunsheng.yzb.modules.scm.service.StockInManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 入库管理接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/stock-in")
public class StockInManagementController {

    @Resource
    private StockInManagementService stockInManagementService;

    @GetMapping("/orders")
    public AjaxResult<PageResult<StockInOrderEntity>> orderPage(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryStockInOrders(query));
    }

    @GetMapping("/orders/{stockInOrderId}")
    public AjaxResult<ScmView.StockInDetail> orderDetail(@PathVariable Long stockInOrderId) {
        return AjaxResult.success(stockInManagementService.getStockInDetail(stockInOrderId));
    }

    @PostMapping("/receipts/{receiptId}")
    public AjaxResult<StockInOrderEntity> create(@PathVariable Long receiptId,
                                                 @Valid @RequestBody ScmRequest.StockInSave request) {
        return AjaxResult.success(stockInManagementService.createStockIn(receiptId, request));
    }

    @GetMapping("/pending-items")
    public AjaxResult<PageResult<ScmView.PendingStockInItem>> pendingItems(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryPendingStockInItems(query));
    }
}