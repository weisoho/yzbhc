package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetTransferRecord;
import com.yunsheng.yzb.model.AssetTransferRecordExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AssetTransferRecordMapper {
    int countByExample(AssetTransferRecordExample example);

    int deleteByExample(AssetTransferRecordExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(AssetTransferRecord record);

    int insertSelective(AssetTransferRecord record);

    List<AssetTransferRecord> selectByExample(AssetTransferRecordExample example);

    AssetTransferRecord selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") AssetTransferRecord record, @Param("example") AssetTransferRecordExample example);

    int updateByExample(@Param("record") AssetTransferRecord record, @Param("example") AssetTransferRecordExample example);

    int updateByPrimaryKeySelective(AssetTransferRecord record);

    int updateByPrimaryKey(AssetTransferRecord record);
}