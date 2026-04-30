package com.yunsheng.yzb.mapper.scm;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yunsheng.yzb.model.scm.InventoryEntity;
import com.yunsheng.yzb.vo.LossVo;

import java.util.List;

/**
 * 库存 Mapper。
 */
public interface InventoryMapper extends BaseMapper<InventoryEntity> {

    //损耗汇总
    List<LossVo> lossCountPage(Integer id);
}