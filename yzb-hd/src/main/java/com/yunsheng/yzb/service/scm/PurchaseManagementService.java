package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.vo.scm.ExceptionOrderDetailView;
import com.yunsheng.yzb.model.scm.ExceptionOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseOrderEntity;
import com.yunsheng.yzb.model.scm.PurchaseReceiveEntity;

import java.util.List;

/**
 * 采购管理服务。
 */
public interface PurchaseManagementService {

    /**
     * 分页查询采购单。
     *
     * @param query 查询条件
     * @return 采购单分页结果
     */
    PageResult<ScmView.PurchaseOrderDetail> queryOrders(ScmRequest.PurchaseQuery query);

    /**
     * 查询采购单详情。
     *
     * @param orderId 采购单主键
     * @return 采购单详情
     */
    ScmView.PurchaseOrderDetail getOrderDetail(Long orderId);

    /**
     * 新增采购单。
     *
     * @param request 采购单保存参数
     * @return 新增后的采购单信息
     */
    PurchaseOrderEntity createOrder(ScmRequest.PurchaseSave request);

    /**
     * 更新采购单。
     *
     * @param orderId 采购单主键
     * @param request 采购单保存参数
     * @return 更新后的采购单信息
     */
    PurchaseOrderEntity updateOrder(Long orderId, ScmRequest.PurchaseSave request);

    /**
     * 删除采购单。
     *
     * @param orderId 采购单主键
     */
    void deleteOrder(Long orderId);

    /**
     * 提交采购单。
     *
     * @param orderId 采购单主键
     * @param operatorName 提交人
     * @return 提交后的采购单信息
     */
    PurchaseOrderEntity submitOrder(Long orderId, String operatorName);

    /**
     * 审核通过采购单。
     *
     * @param orderId 采购单主键
     * @param request 审核参数
     * @return 审核后的采购单信息
     */
    PurchaseOrderEntity approveOrder(Long orderId, ScmRequest.PurchaseAudit request);

    /**
     * 驳回采购单。
     *
     * @param orderId 采购单主键
     * @param request 审核参数
     * @return 驳回后的采购单信息
     */
    PurchaseOrderEntity rejectOrder(Long orderId, ScmRequest.PurchaseAudit request);

    /**
     * 分页查询待收货采购单。
     *
     * @param query 查询条件
     * @return 待收货采购单分页结果
     */
    PageResult<ScmView.PurchaseOrderDetail> queryPendingReceiveOrders(ScmRequest.PurchaseQuery query);

    /**
     * 执行采购收货。
     *
     * @param orderId 采购单主键
     * @param request 收货参数
     * @return 收货单信息
     */
    PurchaseReceiveEntity receiveOrder(Long orderId, ScmRequest.PurchaseReceiveSave request);

    /**
     * 收货阶段拒收采购单。
     *
     * @param orderId 采购单主键
     * @param request 拒收参数
     * @return 拒收后的采购单
     */
    PurchaseOrderEntity receiveRejectOrder(Long orderId, ScmRequest.PurchaseReceiveReject request);

    /**
     * 分页查询收货单。
     *
     * @param query 查询条件
     * @return 收货单分页结果
     */
    PageResult<PurchaseReceiveEntity> queryReceipts(ScmRequest.PurchaseQuery query);

    /**
     * 查询收货单详情。
     *
     * @param receiptId 收货单主键
     * @return 收货单详情
     */
    ScmView.PurchaseReceiveDetail getReceiptDetail(Long receiptId);

    /**
     * 分页查询异常订单。
     *
     * @param query 查询条件
     * @return 异常订单分页结果
     */
    PageResult<ExceptionOrderEntity> queryExceptionOrders(ScmRequest.PurchaseQuery query);

    ExceptionOrderDetailView getExceptionOrderDetail(Long exceptionOrderId);

    ExceptionOrderEntity updateExceptionOrder(Long exceptionOrderId, ScmRequest.ExceptionOrderUpdate request);

    boolean deleteExceptionOrder(Long exceptionOrderId, String operatorName);

    /**
     * 重新提交异常订单。
     *
     * @param exceptionOrderId 异常订单主键
     * @param operatorName 处理人
     * @return 更新后的异常订单信息
     */
    ExceptionOrderEntity resubmitExceptionOrder(Long exceptionOrderId, String operatorName);

    /**
     * 查询待入库收货单。
     *
     * @return 待入库收货单列表
     */
    List<PurchaseReceiveEntity> listPendingStockInReceipts();
}
