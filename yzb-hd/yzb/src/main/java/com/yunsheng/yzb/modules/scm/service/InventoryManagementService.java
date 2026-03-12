package com.yunsheng.yzb.modules.scm.service;

import com.yunsheng.yzb.modules.scm.dto.PageResult;
import com.yunsheng.yzb.modules.scm.dto.ScmRequest;
import com.yunsheng.yzb.modules.scm.dto.ScmView;
import com.yunsheng.yzb.modules.scm.entity.InventoryTransactionEntity;

/**
 * 库存管理服务。
 */
public interface InventoryManagementService {

    PageResult<ScmView.InventoryDetail> queryInventory(ScmRequest.InventoryQuery query);

    ScmView.InventoryDetail getInventoryDetail(Long inventoryId);

    ScmView.InventoryDetail adjustInventory(Long inventoryId, ScmRequest.InventoryAdjustSave request);

    PageResult<InventoryTransactionEntity> queryTransactions(ScmRequest.InventoryQuery query);
}