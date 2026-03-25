package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.CheckInventory;
import com.yunsheng.yzb.model.CheckInventoryExample;
import java.util.List;

import com.yunsheng.yzb.vo.CheckInventoryVo;
import org.apache.ibatis.annotations.Param;

public interface CheckInventoryMapper {
    int countByExample(CheckInventoryExample example);

    int deleteByExample(CheckInventoryExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(CheckInventory record);

    int insertSelective(CheckInventory record);

    List<CheckInventory> selectByExample(CheckInventoryExample example);
    //盘点
    List<CheckInventoryVo> selectpdxyModelList();

    CheckInventory selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") CheckInventory record, @Param("example") CheckInventoryExample example);

    int updateByExample(@Param("record") CheckInventory record, @Param("example") CheckInventoryExample example);

    int updateByPrimaryKeySelective(CheckInventory record);

    int updateByPrimaryKey(CheckInventory record);
}