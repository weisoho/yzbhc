package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.model.scm.StockOutItemEntity;
import com.yunsheng.yzb.model.scm.StockOutOrderEntity;

/**
 * 出库管理服务。
 */
public interface StockOutManagementService {

    /**
     * 执行出库。
     *
     * @param request 出库保存参数
     * @return 出库单信息
     */
    StockOutOrderEntity createStockOut(ScmRequest.StockOutSave request);

    /**
     * 分页查询可撤销出库明细。
     *
     * @param query 查询条件
     * @return 可撤销出库分页结果
     */
    PageResult<StockOutItemEntity> queryUndoList(ScmRequest.StockOutQuery query);

    /**
     * 撤销出库。
     *
     * @param materialCode 物资编码
     * @param outboundDate 出库日期
     * @param request 撤销参数
     * @return 撤销后的出库单信息
     */
    StockOutOrderEntity undoStockOut(String materialCode, String outboundDate, ScmRequest.UndoSave request);
}