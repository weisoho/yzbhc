package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.StockInOrderEntity;

/**
 * 入库管理服务。
 */
public interface StockInManagementService {

    PageResult<StockInOrderEntity> queryStockInOrders(ScmRequest.StockInQuery query);

    ScmView.StockInDetail getStockInDetail(Long stockInOrderId);

    StockInOrderEntity createStockIn(Long receiptId, ScmRequest.StockInSave request);

    StockInOrderEntity updateStockIn(Long stockInOrderId, ScmRequest.StockInSave request);

    PageResult<ScmView.PendingStockInItem> queryPendingStockInItems(ScmRequest.StockInQuery query);
}