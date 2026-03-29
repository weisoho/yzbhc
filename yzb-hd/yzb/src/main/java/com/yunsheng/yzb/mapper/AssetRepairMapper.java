package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetRepair;
import com.yunsheng.yzb.model.AssetRepairExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AssetRepairMapper {
    int countByExample(AssetRepairExample example);

    int deleteByExample(AssetRepairExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(AssetRepair record);

    int insertSelective(AssetRepair record);

    List<AssetRepair> selectByExample(AssetRepairExample example);

    AssetRepair selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") AssetRepair record, @Param("example") AssetRepairExample example);

    int updateByExample(@Param("record") AssetRepair record, @Param("example") AssetRepairExample example);

    int updateByPrimaryKeySelective(AssetRepair record);

    int updateByPrimaryKey(AssetRepair record);
}