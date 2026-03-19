package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.StockOutItemEntity;
import com.yunsheng.yzb.model.scm.StockOutOrderEntity;
import com.yunsheng.yzb.service.scm.StockOutManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 出库管理控制器。
 * 提供出库执行、撤销列表和撤销出库接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/stock-out")
public class StockOutManagementController {

    /**
     * 出库管理服务。
     */
    @Resource
    private StockOutManagementService stockOutManagementService;

    /**
     * 执行出库。
     *
     * @param request 出库请求体，JSON 格式
     * @return 出库单信息
     */
    @PostMapping
    public AjaxResult<StockOutOrderEntity> create(@Valid @RequestBody ScmRequest.StockOutSave request) {
        return AjaxResult.success(stockOutManagementService.createStockOut(request));
    }

    /**
     * 分页查询可撤销出库明细。
     *
     * @param query 出库撤销查询条件
     * @return 可撤销出库分页结果
     */
    @GetMapping("/undo-list")
    public AjaxResult<PageResult<StockOutItemEntity>> undoList(ScmRequest.StockOutQuery query) {
        return AjaxResult.success(stockOutManagementService.queryUndoList(query));
    }

    /**
     * 撤销指定物资和日期的出库记录。
     *
     * @param materialCode 物资编码
     * @param outboundDate 出库日期，格式为 yyyy-MM-dd
     * @param request 撤销请求体，JSON 格式
     * @return 撤销后的出库单信息
     */
    @PostMapping("/undo")
    public AjaxResult<StockOutOrderEntity> undo(@RequestParam String materialCode,
                                                @RequestParam String outboundDate,
                                                @Valid @RequestBody ScmRequest.UndoSave request) {
        return AjaxResult.success(stockOutManagementService.undoStockOut(materialCode, outboundDate, request));
    }
}