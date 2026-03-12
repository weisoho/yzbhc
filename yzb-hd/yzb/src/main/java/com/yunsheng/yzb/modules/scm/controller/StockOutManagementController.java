package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.StockOutItemEntity;
import com.yunsheng.yzb.modules.scm.entity.StockOutOrderEntity;
import com.yunsheng.yzb.modules.scm.service.StockOutManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 出库管理接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/stock-out")
public class StockOutManagementController {

    @Resource
    private StockOutManagementService stockOutManagementService;

    @PostMapping
    public AjaxResult<StockOutOrderEntity> create(@Valid @RequestBody ScmRequest.StockOutSave request) {
        return AjaxResult.success(stockOutManagementService.createStockOut(request));
    }

    @GetMapping("/undo-list")
    public AjaxResult<PageResult<StockOutItemEntity>> undoList(ScmRequest.StockOutQuery query) {
        return AjaxResult.success(stockOutManagementService.queryUndoList(query));
    }

    @PostMapping("/undo")
    public AjaxResult<StockOutOrderEntity> undo(@RequestParam String materialCode,
                                                @RequestParam String outboundDate,
                                                @Valid @RequestBody ScmRequest.UndoSave request) {
        return AjaxResult.success(stockOutManagementService.undoStockOut(materialCode, outboundDate, request));
    }
}