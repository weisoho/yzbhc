package com.yunsheng.yzb.controller.scm;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.dto.StockDto;
import com.yunsheng.yzb.mapper.scm.StockInItemMapper;
import com.yunsheng.yzb.model.SampleItem;
import com.yunsheng.yzb.model.SampleMan;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.StockInOrderEntity;
import com.yunsheng.yzb.model.scm.StockInItemEntity;
import com.yunsheng.yzb.service.scm.StockInManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.vo.scm.StockInItemVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 入库管理控制器。
 * 提供入库单查询、详情和入库执行接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/stock-in")
public class StockInManagementController {

    /**
     * 入库管理服务。
     */
    @Resource
    private StockInManagementService stockInManagementService;
    @Autowired
    private StockInItemMapper stockInItemMapper;

    /**
     * 分页查询入库单。
     *
     * @param query 入库分页查询条件
     * @return 入库单分页结果
     */
    @GetMapping("/orders")
    public AjaxResult<PageResult<StockInOrderEntity>> orderPage(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryStockInOrders(query));
    }

    /**
     * 分页查询入库明细。
     *
     * @param query 查询条件
     * @return 入库明细分页结果
     */
    @GetMapping("/items")
    public AjaxResult<PageResult<StockInItemEntity>> itemPage(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryStockInItems(query));
    }

    /**
     * 仓库入库汇总
     */
    @GetMapping("/SummaryStock")
    public AjaxResult<PageResult<StockInItemEntity>> summaryStock(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryStockInItems(query));
    }


    /**
     * 查询入库单详情。
     *
     * @param stockInOrderId 入库单主键
     * @return 入库单详情
     */
    @GetMapping("/orders/{stockInOrderId}")
    public AjaxResult<ScmView.StockInDetail> orderDetail(@PathVariable Long stockInOrderId) {
        return AjaxResult.success(stockInManagementService.getStockInDetail(stockInOrderId));
    }

    /**
     * 根据收货单创建入库单。
     *
     * @param receiptId 收货单主键
     * @param request 入库保存请求体，JSON 格式
     * @return 新增后的入库单信息
     */
    @PostMapping("/receipts/{receiptId}")
    public AjaxResult<StockInOrderEntity> create(@PathVariable Long receiptId,
                                                 @Valid @RequestBody ScmRequest.StockInSave request) {
        return AjaxResult.success(stockInManagementService.createStockIn(receiptId, request));
    }

    /**
     * 手动入库（初始化入库）。
     *
     * @param request 入库保存请求体
     * @return 新增后的入库单信息
     */
    @PostMapping("/manual")
    public AjaxResult<StockInOrderEntity> createManual(@Valid @RequestBody ScmRequest.StockInSave request) {
        return AjaxResult.success(stockInManagementService.createManualStockIn(request));
    }

    /**
     * 分页查询待入库明细。
     *
     * @param query 待入库查询条件
     * @return 待入库明细分页结果
     */
    @GetMapping("/pending-items")
    public AjaxResult<PageResult<ScmView.PendingStockInItem>> pendingItems(ScmRequest.StockInQuery query) {
        return AjaxResult.success(stockInManagementService.queryPendingStockInItems(query));
    }

    /**
     * 统计入库明细
     */
    @PostMapping("/countStock")
    public AjaxResult countStock(@RequestBody StockDto dto) {
        PageHelper.startPage(dto.getPageNum(), dto.getPageSize());
        List<StockInItemVo> stockInItemVoList = stockInItemMapper.selectStockCountByInventory();

        PageInfo<StockInItemVo> pageInfo = new PageInfo<>(stockInItemVoList);
        return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }
}