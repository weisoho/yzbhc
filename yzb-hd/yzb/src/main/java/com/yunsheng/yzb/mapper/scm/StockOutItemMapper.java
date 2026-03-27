package com.yunsheng.yzb.mapper.scm;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yunsheng.yzb.model.scm.StockOutItemEntity;
import com.yunsheng.yzb.vo.scm.StockOutItemVo;

import java.util.List;

/**
 * 出库明细 Mapper。
 */
public interface StockOutItemMapper extends BaseMapper<StockOutItemEntity> {

    //查询所属部门下的仓库的入库明细，当前仓库表没有部门iD
    //参数占时不传，后面加入了，在传参数
    List<StockOutItemVo> selectStockOutCount();
}