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
import java.util.List;

/**
 * 前端兼容的初始化入库接口。
 */
@Validated
@RestController
@RequestMapping("/api/manual-stock-in")
public class ManualStockInController {

    @Resource
    private StockInManagementService stockInManagementService;

    @GetMapping
    public AjaxResult<List<ScmView.PendingStockInItem>> list() {
        PageResult<ScmView.PendingStockInItem> pageResult = stockInManagementService.queryPendingStockInItems(new ScmRequest.StockInQuery());
        return AjaxResult.success(pageResult.getRecords());
    }

    @GetMapping("/search")
    public AjaxResult<List<ScmView.PendingStockInItem>> search(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryPendingStockInItems(query).getRecords());
    }

    @PostMapping
    public AjaxResult<StockInOrderEntity> create(@Valid @RequestBody ScmRequest.StockInSave request,
                                                 @RequestParam Long receiptId) {
        return AjaxResult.success(stockInManagementService.createStockIn(receiptId, request));
    }
}