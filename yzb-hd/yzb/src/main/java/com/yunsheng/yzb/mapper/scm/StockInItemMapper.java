package com.yunsheng.yzb.mapper.scm;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yunsheng.yzb.model.SysRole;
import com.yunsheng.yzb.model.scm.StockInItemEntity;
import com.yunsheng.yzb.vo.scm.StockInItemVo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 入库明细 Mapper。
 */
public interface StockInItemMapper extends BaseMapper<StockInItemEntity> {


    //查询所属部门下的仓库的入库明细，当前仓库表没有部门iD
    //参数占时不传，后面加入了，在传参数
    List<StockInItemVo> selectStockCountByInventory();
}