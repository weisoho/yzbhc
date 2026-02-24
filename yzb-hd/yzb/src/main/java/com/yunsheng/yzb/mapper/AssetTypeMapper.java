package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetType;
import com.yunsheng.yzb.model.AssetTypeExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AssetTypeMapper {
    int countByExample(AssetTypeExample example);

    int deleteByExample(AssetTypeExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(AssetType record);

    int insertSelective(AssetType record);

    List<AssetType> selectByExample(AssetTypeExample example);

    /**
     * 查询资产类型
     */
    List<AssetType> selectAssetType(@Param("assetCode") String assetCode,@Param("assetName") String assetName,@Param("assetState")Integer assetState);

    AssetType selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") AssetType record, @Param("example") AssetTypeExample example);

    int updateByExample(@Param("record") AssetType record, @Param("example") AssetTypeExample example);

    int updateByPrimaryKeySelective(AssetType record);

    int updateByPrimaryKey(AssetType record);
}