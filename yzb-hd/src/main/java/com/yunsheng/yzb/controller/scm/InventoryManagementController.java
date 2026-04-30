package com.yunsheng.yzb.controller.scm;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yunsheng.yzb.dto.InventoryDto;
import com.yunsheng.yzb.mapper.CheckInventoryMapper;
import com.yunsheng.yzb.mapper.scm.InventoryMapper;
import com.yunsheng.yzb.mapper.scm.StockInItemMapper;
import com.yunsheng.yzb.model.CheckInventory;
import com.yunsheng.yzb.model.CheckInventoryExample;
import com.yunsheng.yzb.model.scm.StockInItemEntity;
import com.yunsheng.yzb.utils.ClassCastUtil;
import com.yunsheng.yzb.vo.LossVo;
import com.yunsheng.yzb.vo.scm.PageResult;
import com.yunsheng.yzb.vo.scm.ScmRequest;
import com.yunsheng.yzb.vo.scm.ScmView;
import com.yunsheng.yzb.model.scm.InventoryTransactionEntity;
import com.yunsheng.yzb.service.scm.InventoryManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.math.BigDecimal;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;
import java.util.List;

/**
 * 库存管理控制器。
 * 提供库存查询、阈值调整和库存流水查询接口。
 */
@Validated
@RestController
@RequestMapping("/api/scm/inventory")
public class InventoryManagementController {

    /**
     * 库存管理服务。
     */
    @Resource
    private InventoryManagementService inventoryManagementService;
    @Autowired
    private InventoryMapper inventoryMapper;
    @Autowired
    private CheckInventoryMapper checkInventoryMapper;
    @Autowired
    private StockInItemMapper stockInItemMapper;

    /**
     * 分页查询库存列表。
     *
     * @param query 库存分页查询条件
     * @return 库存分页结果
     */
    @GetMapping
    public AjaxResult<PageResult<ScmView.InventoryDetail>> page(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryInventory(query));
    }

    /**
     * 查询库存详情。
     *
     * @param inventoryId 库存主键
     * @return 库存详情
     */
    @GetMapping("/{inventoryId}")
    public AjaxResult<ScmView.InventoryDetail> detail(@PathVariable Long inventoryId) {
        return AjaxResult.success(inventoryManagementService.getInventoryDetail(inventoryId));
    }

    /**
     * 调整库存预警阈值。
     *
     * @param inventoryId 库存主键
     * @param request 阈值调整请求体，JSON 格式
     * @return 调整后的库存详情
     */
    @PutMapping("/{inventoryId}/adjust")
    public AjaxResult<ScmView.InventoryDetail> adjust(@PathVariable Long inventoryId,
                                                      @Valid @RequestBody ScmRequest.InventoryAdjustSave request) {
        return AjaxResult.success(inventoryManagementService.adjustInventory(inventoryId, request));
    }

    /**
     * 分页查询库存流水。
     *
     * @param query 库存流水查询条件
     * @return 库存流水分页结果
     */
    @GetMapping("/transactions")
    public AjaxResult<PageResult<InventoryTransactionEntity>> transactions(ScmRequest.InventoryQuery query) {
        return AjaxResult.success(inventoryManagementService.queryTransactions(query));
    }

    /**
     * 损耗汇总
     */
     @PostMapping("/lossCountPage")
    public AjaxResult lossCountPage(@RequestBody InventoryDto dto) {
         LocalDate today = LocalDate.now();
      // 获取上个月的第一天
         LocalDate firstDayOfLastMonth = today.with(TemporalAdjusters.firstDayOfMonth())
                 .minusMonths(1);

         // 获取上个月最后一天
         LocalDate lastDayOfLastMonth = firstDayOfLastMonth.with(TemporalAdjusters.lastDayOfMonth());

         LocalDate firstDayOfMonth = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
         LocalDate lastDayOfMonth = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());

         Date lastDate1 = Date.from(firstDayOfLastMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
         Date lastDate2 = Date.from(lastDayOfLastMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());

         Date date1 = Date.from(firstDayOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());
         Date date2 = Date.from(lastDayOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant());

         PageHelper.startPage(dto.getPageNum(), dto.getPageSize());
         List<LossVo> lossVoList = inventoryMapper.lossCountPage(dto.getInventoryId());
         if(lossVoList.size()>0){
             for (LossVo lossVo : lossVoList) {
                 //===============上个月月盘点量======================
                CheckInventoryExample inventoryExample1 = new CheckInventoryExample();
                 inventoryExample1.createCriteria().andInventoryIdEqualTo(lossVo.getInventoryId()).andCheDateBetween(lastDate1,lastDate2).andStatusEqualTo(2);
                 List<CheckInventory> checkInventoryList1 = checkInventoryMapper.selectByExample(inventoryExample1);
                 Integer lassMonthNum =0;
                 if(checkInventoryList1.size()>0){
                     for (CheckInventory checkInventory : checkInventoryList1) {
                         lassMonthNum=lassMonthNum+ checkInventory.getActualNum();
                     }
                 }
                 lossVo.setLassMonthNum(lassMonthNum);

                 //===============本月盘点量======================
                CheckInventoryExample inventoryExample2 = new CheckInventoryExample();
                 inventoryExample2.createCriteria().andInventoryIdEqualTo(lossVo.getInventoryId()).andCheDateBetween(date1,date2).andStatusEqualTo(2);
                 List<CheckInventory> checkInventoryList2 = checkInventoryMapper.selectByExample(inventoryExample2);
                 Integer monthNum =0;
                 if(checkInventoryList2.size()>0){
                     for (CheckInventory checkInventory : checkInventoryList2) {
                         monthNum=monthNum+ checkInventory.getActualNum();
                     }
                 }
                 lossVo.setCheckMonthNum(monthNum);

                 List<StockInItemEntity> items = stockInItemMapper.selectList(new LambdaQueryWrapper<StockInItemEntity>()
                         .gt(StockInItemEntity::getCreateTime, date1)
                         .lt(StockInItemEntity::getCreateTime, date2));

                //订货量
                 Integer orderMonthNum=0;
                 if(items.size()>0){
                     for (StockInItemEntity item : items) {
                         orderMonthNum=orderMonthNum+item.getOrderQuantity();
                         lossVo.setOrderMonthNum(orderMonthNum);
                     }
                 }

                 //损耗总量
                 lossVo.setLossNum(lossVo.getOrderMonthNum()-lossVo.getCheckMonthNum());
                 BigDecimal lossnum = new BigDecimal(lossVo.getLossNum());
                 BigDecimal ordernum = new BigDecimal(lossVo.getOrderMonthNum());
                 BigDecimal divide = lossnum.divide(ordernum);
                 lossVo.setLossRate(divide.multiply(new BigDecimal(100)).toString());
             }
         }


         PageInfo<LossVo> pageInfo = new PageInfo<>(lossVoList);
         return AjaxResult.res(1,"成功", ClassCastUtil.pageInfoToPageOutputDto(pageInfo));
    }
}