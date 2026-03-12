package com.yunsheng.yzb.modules.scm.controller;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.ExceptionOrderEntity;
import com.yunsheng.yzb.modules.scm.entity.PurchaseOrderEntity;
import com.yunsheng.yzb.modules.scm.entity.PurchaseReceiveEntity;
import com.yunsheng.yzb.modules.scm.service.PurchaseManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 采购管理接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/purchases")
public class PurchaseManagementController {

    @Resource
    private PurchaseManagementService purchaseManagementService;

    @GetMapping("/orders")
    public AjaxResult<PageResult<PurchaseOrderEntity>> orderPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryOrders(query));
    }

    @GetMapping("/orders/{orderId}")
    public AjaxResult<ScmView.PurchaseOrderDetail> orderDetail(@PathVariable Long orderId) {
        return AjaxResult.success(purchaseManagementService.getOrderDetail(orderId));
    }

    @PostMapping("/orders")
    public AjaxResult<PurchaseOrderEntity> createOrder(@Valid @RequestBody ScmRequest.PurchaseSave request) {
        return AjaxResult.success(purchaseManagementService.createOrder(request));
    }

    @PutMapping("/orders/{orderId}")
    public AjaxResult<PurchaseOrderEntity> updateOrder(@PathVariable Long orderId,
                                                       @Valid @RequestBody ScmRequest.PurchaseSave request) {
        return AjaxResult.success(purchaseManagementService.updateOrder(orderId, request));
    }

    @PostMapping("/orders/{orderId}/submit")
    public AjaxResult<PurchaseOrderEntity> submitOrder(@PathVariable Long orderId,
                                                       @RequestParam String operatorName) {
        return AjaxResult.success(purchaseManagementService.submitOrder(orderId, operatorName));
    }

    @PostMapping("/orders/{orderId}/approve")
    public AjaxResult<PurchaseOrderEntity> approveOrder(@PathVariable Long orderId,
                                                        @Valid @RequestBody ScmRequest.PurchaseAudit request) {
        return AjaxResult.success(purchaseManagementService.approveOrder(orderId, request));
    }

    @PostMapping("/orders/{orderId}/reject")
    public AjaxResult<PurchaseOrderEntity> rejectOrder(@PathVariable Long orderId,
                                                       @Valid @RequestBody ScmRequest.PurchaseAudit request) {
        return AjaxResult.success(purchaseManagementService.rejectOrder(orderId, request));
    }

    @GetMapping("/orders/pending-receive")
    public AjaxResult<PageResult<PurchaseOrderEntity>> pendingReceiveOrders(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryPendingReceiveOrders(query));
    }

    @PostMapping("/orders/{orderId}/receive")
    public AjaxResult<PurchaseReceiveEntity> receiveOrder(@PathVariable Long orderId,
                                                          @Valid @RequestBody ScmRequest.PurchaseReceiveSave request) {
        return AjaxResult.success(purchaseManagementService.receiveOrder(orderId, request));
    }

    @GetMapping("/receipts")
    public AjaxResult<PageResult<PurchaseReceiveEntity>> receiptPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryReceipts(query));
    }

    @GetMapping("/receipts/{receiptId}")
    public AjaxResult<ScmView.PurchaseReceiveDetail> receiptDetail(@PathVariable Long receiptId) {
        return AjaxResult.success(purchaseManagementService.getReceiptDetail(receiptId));
    }

    @GetMapping("/receipts/pending-stock-in")
    public AjaxResult<List<PurchaseReceiveEntity>> pendingStockInReceipts() {
        return AjaxResult.success(purchaseManagementService.listPendingStockInReceipts());
    }

    @GetMapping("/exceptions")
    public AjaxResult<PageResult<ExceptionOrderEntity>> exceptionPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryExceptionOrders(query));
    }

    @PostMapping("/exceptions/{exceptionOrderId}/resubmit")
    public AjaxResult<ExceptionOrderEntity> resubmitException(@PathVariable Long exceptionOrderId,
                                                              @RequestParam String operatorName) {
        return AjaxResult.success(purchaseManagementService.resubmitExceptionOrder(exceptionOrderId, operatorName));
    }
}