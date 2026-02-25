package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.Repair;
import com.yunsheng.yzb.model.RepairExample;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface RepairMapper {
    int countByExample(RepairExample example);

    int deleteByExample(RepairExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Repair record);

    int insertSelective(Repair record);

    List<Repair> selectByExample(RepairExample example);
    //查询资产维修列表
    List<Repair> selectRepairList(@Param("assetCode")String assetCode, @Param("assetName")String assetName, @Param("repairType")Integer repairType, @Param("repairStatus")Integer repairStatus,@Param("assetTypeid")Integer assetTypeid , @Param("repairStart")Date repairStart, @Param("repairEnd")Date repairEnd);

    Repair selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Repair record, @Param("example") RepairExample example);

    int updateByExample(@Param("record") Repair record, @Param("example") RepairExample example);

    int updateByPrimaryKeySelective(Repair record);

    int updateByPrimaryKey(Repair record);
}