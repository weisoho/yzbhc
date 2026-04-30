package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.Asset;
import com.yunsheng.yzb.model.AssetExample;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AssetMapper {
    int countByExample(AssetExample example);

    int deleteByExample(AssetExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Asset record);

    int insertSelective(Asset record);

    List<Asset> selectByExample(AssetExample example);
    //资产明细查询
    List<Asset> selectAsset(@Param("assetCode") String assetCode, @Param("assetName") String assetName, @Param("assetState")Integer assetState,
                            @Param("depId")Integer depId,  @Param("assetTypeid")Integer assetTypeid,  @Param("purchaseStart")Date purchaseStart ,
                            @Param("purchaseEnd") Date purchaseEnd);

    Asset selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Asset record, @Param("example") AssetExample example);

    int updateByExample(@Param("record") Asset record, @Param("example") AssetExample example);

    int updateByPrimaryKeySelective(Asset record);

    int updateByPrimaryKey(Asset record);
}