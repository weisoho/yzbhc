package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.entity.StockOutItemEntity;
import com.yunsheng.yzb.modules.scm.entity.StockOutOrderEntity;

/**
 * 出库管理服务。
 */
public interface StockOutManagementService {

    StockOutOrderEntity createStockOut(ScmRequest.StockOutSave request);

    PageResult<StockOutItemEntity> queryUndoList(ScmRequest.StockOutQuery query);

    StockOutOrderEntity undoStockOut(String materialCode, String outboundDate, ScmRequest.UndoSave request);
}