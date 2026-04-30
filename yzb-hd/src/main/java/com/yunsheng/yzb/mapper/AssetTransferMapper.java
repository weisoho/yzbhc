package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetTransfer;
import com.yunsheng.yzb.model.AssetTransferExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AssetTransferMapper {
    int countByExample(AssetTransferExample example);

    int deleteByExample(AssetTransferExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(AssetTransfer record);

    int insertSelective(AssetTransfer record);

    List<AssetTransfer> selectByExample(AssetTransferExample example);

    AssetTransfer selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") AssetTransfer record, @Param("example") AssetTransferExample example);

    int updateByExample(@Param("record") AssetTransfer record, @Param("example") AssetTransferExample example);

    int updateByPrimaryKeySelective(AssetTransfer record);

    int updateByPrimaryKey(AssetTransfer record);
}