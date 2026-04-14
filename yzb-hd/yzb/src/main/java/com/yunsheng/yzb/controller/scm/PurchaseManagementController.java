package com.yunsheng.yzb.controller.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.vo.scm.ExceptionOrderDetailView;
import com.yunsheng.yzb.model.scm.ExceptionOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveEntity;
import com.yunsheng.yzb.service.scm.PurchaseManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 采购管理控制器。
 * 提供采购单、收货单和异常订单相关接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/purchases")
public class PurchaseManagementController {

    /**
     * 采购管理服务。
     */
    @Resource
    private PurchaseManagementService purchaseManagementService;

    /**
     * 分页查询采购单。
     *
     * @param query 采购分页查询条件
     * @return 采购单分页结果
     */
    @GetMapping("/orders")
    public AjaxResult<PageResult<ScmView.PurchaseOrderDetail>> orderPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryOrders(query));
    }

    /**
     * 查询采购单详情。
     *
     * @param orderId 采购单主键
     * @return 采购单详情
     */
    @GetMapping("/orders/{orderId}")
    public AjaxResult<ScmView.PurchaseOrderDetail> orderDetail(@PathVariable Long orderId) {
        return AjaxResult.success(purchaseManagementService.getOrderDetail(orderId));
    }

    /**
     * 新增采购单。
     *
     * @param request 采购单保存请求体，JSON 格式
     * @return 新增后的采购单信息
     */
    @PostMapping("/orders")
    public AjaxResult<PurchaseOrderEntity> createOrder(@Valid @RequestBody ScmRequest.PurchaseSave request) {
        return AjaxResult.success(purchaseManagementService.createOrder(request));
    }

    /**
     * 更新采购单。
     *
     * @param orderId 采购单主键
     * @param request 采购单保存请求体，JSON 格式
     * @return 更新后的采购单信息
     */
    @PutMapping("/orders/{orderId}")
    public AjaxResult<PurchaseOrderEntity> updateOrder(@PathVariable Long orderId,
                                                       @Valid @RequestBody ScmRequest.PurchaseSave request) {
        return AjaxResult.success(purchaseManagementService.updateOrder(orderId, request));
    }

    /**
     * 提交采购单进入审核流程。
     *
     * @param orderId 采购单主键
     * @param operatorName 提交人姓名
     * @return 状态变更后的采购单信息
     */
    @PostMapping("/orders/{orderId}/submit")
    public AjaxResult<PurchaseOrderEntity> submitOrder(@PathVariable Long orderId,
                                                       @RequestParam String operatorName) {
        return AjaxResult.success(purchaseManagementService.submitOrder(orderId, operatorName));
    }

    /**
     * 审核通过采购单。
     *
     * @param orderId 采购单主键
     * @param request 审核请求体，JSON 格式
     * @return 审核后的采购单信息
     */
    @PostMapping("/orders/{orderId}/approve")
    public AjaxResult<PurchaseOrderEntity> approveOrder(@PathVariable Long orderId,
                                                        @Valid @RequestBody ScmRequest.PurchaseAudit request) {
        return AjaxResult.success(purchaseManagementService.approveOrder(orderId, request));
    }

    /**
     * 驳回采购单。
     *
     * @param orderId 采购单主键
     * @param request 审核请求体，JSON 格式
     * @return 驳回后的采购单信息
     */
    @PostMapping("/orders/{orderId}/reject")
    public AjaxResult<PurchaseOrderEntity> rejectOrder(@PathVariable Long orderId,
                                                       @Valid @RequestBody ScmRequest.PurchaseAudit request) {
        return AjaxResult.success(purchaseManagementService.rejectOrder(orderId, request));
    }

    /**
     * 分页查询待收货采购单。
     *
     * @param query 采购分页查询条件
     * @return 待收货采购单分页结果
     */
    @GetMapping("/orders/pending-receive")
    public AjaxResult<PageResult<ScmView.PurchaseOrderDetail>> pendingReceiveOrders(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryPendingReceiveOrders(query));
    }

    /**
     * 对采购单执行收货。
     *
     * @param orderId 采购单主键
     * @param request 收货请求体，JSON 格式
     * @return 收货单信息
     */
    @PostMapping("/orders/{orderId}/receive")
    public AjaxResult<PurchaseReceiveEntity> receiveOrder(@PathVariable Long orderId,
                                                          @Valid @RequestBody ScmRequest.PurchaseReceiveSave request) {
        return AjaxResult.success(purchaseManagementService.receiveOrder(orderId, request));
    }

    /**
     * 收货阶段拒收采购单。
     *
     * @param orderId 采购单主键
     * @param request 拒收请求体
     * @return 拒收后的采购单信息
     */
    @PostMapping("/orders/{orderId}/receive-reject")
    public AjaxResult<PurchaseOrderEntity> receiveRejectOrder(@PathVariable Long orderId,
                                                              @Valid @RequestBody ScmRequest.PurchaseReceiveReject request) {
        return AjaxResult.success(purchaseManagementService.receiveRejectOrder(orderId, request));
    }

    /**
     * 分页查询收货单。
     *
     * @param query 收货分页查询条件
     * @return 收货单分页结果
     */
    @GetMapping("/receipts")
    public AjaxResult<PageResult<PurchaseReceiveEntity>> receiptPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryReceipts(query));
    }

    /**
     * 查询收货单详情。
     *
     * @param receiptId 收货单主键
     * @return 收货单详情
     */
    @GetMapping("/receipts/{receiptId}")
    public AjaxResult<ScmView.PurchaseReceiveDetail> receiptDetail(@PathVariable Long receiptId) {
        return AjaxResult.success(purchaseManagementService.getReceiptDetail(receiptId));
    }

    /**
     * 查询待入库的收货单列表。
     *
     * @return 待入库收货单列表
     */
    @GetMapping("/receipts/pending-stock-in")
    public AjaxResult<List<PurchaseReceiveEntity>> pendingStockInReceipts() {
        return AjaxResult.success(purchaseManagementService.listPendingStockInReceipts());
    }

    /**
     * 分页查询异常订单。
     *
     * @param query 异常订单分页查询条件
     * @return 异常订单分页结果
     */
    @GetMapping("/exceptions")
    public AjaxResult<PageResult<ExceptionOrderEntity>> exceptionPage(ScmRequest.PurchaseQuery query) {
        return AjaxResult.success(purchaseManagementService.queryExceptionOrders(query));
    }

    @GetMapping("/exceptions/{exceptionOrderId}")
    public AjaxResult<ExceptionOrderDetailView> exceptionDetail(@PathVariable Long exceptionOrderId) {
        return AjaxResult.success(purchaseManagementService.getExceptionOrderDetail(exceptionOrderId));
    }

    @PutMapping("/exceptions/{exceptionOrderId}")
    public AjaxResult<ExceptionOrderEntity> updateException(@PathVariable Long exceptionOrderId,
                                                            @RequestBody ScmRequest.ExceptionOrderUpdate request) {
        return AjaxResult.success(purchaseManagementService.updateExceptionOrder(exceptionOrderId, request));
    }

    @DeleteMapping("/exceptions/{exceptionOrderId}")
    public AjaxResult<Boolean> deleteException(@PathVariable Long exceptionOrderId,
                                               @RequestParam(required = false) String operatorName) {
        String name = StringUtils.hasText(operatorName) ? operatorName : "系统";
        return AjaxResult.success(purchaseManagementService.deleteExceptionOrder(exceptionOrderId, name));
    }

    /**
     * 重新提交异常订单。
     *
     * @param exceptionOrderId 异常订单主键
     * @param operatorName 处理人姓名
     * @return 更新后的异常订单信息
     */
    @PostMapping("/exceptions/{exceptionOrderId}/resubmit")
    public AjaxResult<ExceptionOrderEntity> resubmitException(@PathVariable Long exceptionOrderId,
                                                              @RequestParam(required = false) String operatorName,
                                                              @RequestBody(required = false) Map<String, Object> body) {
        String name = operatorName;
        if (!StringUtils.hasText(name) && body != null && body.get("operatorName") != null) {
            name = String.valueOf(body.get("operatorName"));
        }
        if (!StringUtils.hasText(name)) {
            name = "系统";
        }
        return AjaxResult.success(purchaseManagementService.resubmitExceptionOrder(exceptionOrderId, name));
    }
}
