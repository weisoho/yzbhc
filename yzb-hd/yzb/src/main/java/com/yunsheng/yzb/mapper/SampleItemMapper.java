package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SampleItem;
import com.yunsheng.yzb.model.SampleItemExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface SampleItemMapper {
    int countByExample(SampleItemExample example);

    int deleteByExample(SampleItemExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(SampleItem record);

    int insertSelective(SampleItem record);

    List<SampleItem> selectByExample(SampleItemExample example);

    SampleItem selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") SampleItem record, @Param("example") SampleItemExample example);

    int updateByExample(@Param("record") SampleItem record, @Param("example") SampleItemExample example);

    int updateByPrimaryKeySelective(SampleItem record);

    int updateByPrimaryKey(SampleItem record);
}