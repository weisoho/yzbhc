package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;

/**
 * 库存管理服务。
 */
public interface InventoryManagementService {

    /**
     * 分页查询库存。
     *
     * @param query 查询条件
     * @return 库存分页结果
     */
    PageResult<ScmView.InventoryDetail> queryInventory(ScmRequest.InventoryQuery query);

    /**
     * 查询库存详情。
     *
     * @param inventoryId 库存主键
     * @return 库存详情
     */
    ScmView.InventoryDetail getInventoryDetail(Long inventoryId);

    /**
     * 调整库存阈值。
     *
     * @param inventoryId 库存主键
     * @param request 阈值调整参数
     * @return 调整后的库存详情
     */
    ScmView.InventoryDetail adjustInventory(Long inventoryId, ScmRequest.InventoryAdjustSave request);

    /**
     * 分页查询库存流水。
     *
     * @param query 查询条件
     * @return 库存流水分页结果
     */
    PageResult<InventoryTransactionEntity> queryTransactions(ScmRequest.InventoryQuery query);
}