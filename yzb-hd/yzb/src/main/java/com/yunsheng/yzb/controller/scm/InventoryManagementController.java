package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.service.scm.InventoryManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * 库存管理控制器。
 * 提供库存查询、阈值调整和库存流水查询接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/inventory")
public class InventoryManagementController {

    /**
     * 库存管理服务。
     */
    @Resource
    private InventoryManagementService inventoryManagementService;

    /**
     * 分页查询库存列表。
     *
     * @param query 库存分页查询条件
     * @return 库存分页结果
     */
    @GetMapping
    public AjaxResult<PageResult<ScmView.InventoryDetail>> page(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryInventory(query));
    }

    /**
     * 查询库存详情。
     *
     * @param inventoryId 库存主键
     * @return 库存详情
     */
    @GetMapping("/{inventoryId}")
    public AjaxResult<ScmView.InventoryDetail> detail(@PathVariable Long inventoryId) {
        return AjaxResult.success(inventoryManagementService.getInventoryDetail(inventoryId));
    }

    /**
     * 调整库存预警阈值。
     *
     * @param inventoryId 库存主键
     * @param request 阈值调整请求体，JSON 格式
     * @return 调整后的库存详情
     */
    @PutMapping("/{inventoryId}/adjust")
    public AjaxResult<ScmView.InventoryDetail> adjust(@PathVariable Long inventoryId,
                                                      @Valid @RequestBody ScmRequest.InventoryAdjustSave request) {
        return AjaxResult.success(inventoryManagementService.adjustInventory(inventoryId, request));
    }

    /**
     * 分页查询库存流水。
     *
     * @param query 库存流水查询条件
     * @return 库存流水分页结果
     */
    @GetMapping("/transactions")
    public AjaxResult<PageResult<InventoryTransactionEntity>> transactions(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryTransactions(query));
    }

    /**
     * 损耗汇总
     */
     @GetMapping("/shcountpage")
    public AjaxResult<PageResult<ScmView.InventoryDetail>> shpage(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryInventory(query));
    }
}