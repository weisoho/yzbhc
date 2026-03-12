package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.ExceptionOrderEntity;
import com.yunsheng.yzb.modules.scm.entity.PurchaseOrderEntity;
import com.yunsheng.yzb.modules.scm.entity.PurchaseReceiveEntity;

import java.util.List;

/**
 * 采购管理服务。
 */
public interface PurchaseManagementService {

    PageResult<PurchaseOrderEntity> queryOrders(ScmRequest.PurchaseQuery query);

    ScmView.PurchaseOrderDetail getOrderDetail(Long orderId);

    PurchaseOrderEntity createOrder(ScmRequest.PurchaseSave request);

    PurchaseOrderEntity updateOrder(Long orderId, ScmRequest.PurchaseSave request);

    PurchaseOrderEntity submitOrder(Long orderId, String operatorName);

    PurchaseOrderEntity approveOrder(Long orderId, ScmRequest.PurchaseAudit request);

    PurchaseOrderEntity rejectOrder(Long orderId, ScmRequest.PurchaseAudit request);

    PageResult<PurchaseOrderEntity> queryPendingReceiveOrders(ScmRequest.PurchaseQuery query);

    PurchaseReceiveEntity receiveOrder(Long orderId, ScmRequest.PurchaseReceiveSave request);

    PageResult<PurchaseReceiveEntity> queryReceipts(ScmRequest.PurchaseQuery query);

    ScmView.PurchaseReceiveDetail getReceiptDetail(Long receiptId);

    PageResult<ExceptionOrderEntity> queryExceptionOrders(ScmRequest.PurchaseQuery query);

    ExceptionOrderEntity resubmitExceptionOrder(Long exceptionOrderId, String operatorName);

    List<PurchaseReceiveEntity> listPendingStockInReceipts();
}