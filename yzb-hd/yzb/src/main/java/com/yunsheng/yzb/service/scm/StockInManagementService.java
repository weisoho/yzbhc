package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.StockInOrderEntity;
import com.yunsheng.yzb.model.scm.StockInItemEntity;

/**
 * 入库管理服务。
 */
public interface StockInManagementService {

    /**
     * 分页查询入库单。
     *
     * @param query 查询条件
     * @return 入库单分页结果
     */
    PageResult<StockInOrderEntity> queryStockInOrders(ScmRequest.StockInQuery query);

    /**
     * 分页查询入库明细。
     *
     * @param query 查询条件
     * @return 入库明细分页结果
     */
    PageResult<StockInItemEntity> queryStockInItems(ScmRequest.StockInQuery query);

    /**
     * 查询入库单详情。
     *
     * @param stockInOrderId 入库单主键
     * @return 入库单详情
     */
    ScmView.StockInDetail getStockInDetail(Long stockInOrderId);

    /**
     * 创建入库单。
     *
     * @param receiptId 收货单主键
     * @param request 入库保存参数
     * @return 新增后的入库单信息
     */
    StockInOrderEntity createStockIn(Long receiptId, ScmRequest.StockInSave request);

    /**
     * 创建手动入库单（初始化入库）。
     *
     * @param request 入库保存参数
     * @return 新增后的入库单信息
     */
    StockInOrderEntity createManualStockIn(ScmRequest.StockInSave request);

    /**
     * 更新入库单。
     *
     * @param stockInOrderId 入库单主键
     * @param request 入库保存参数
     * @return 更新后的入库单信息
     */
    StockInOrderEntity updateStockIn(Long stockInOrderId, ScmRequest.StockInSave request);

    /**
     * 分页查询待入库明细。
     *
     * @param query 查询条件
     * @return 待入库明细分页结果
     */
    PageResult<ScmView.PendingStockInItem> queryPendingStockInItems(ScmRequest.StockInQuery query);
}