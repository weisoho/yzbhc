package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.SampleMan;
import com.yunsheng.yzb.model.SampleManExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface SampleManMapper {
    int countByExample(SampleManExample example);

    int deleteByExample(SampleManExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(SampleMan record);

    int insertSelective(SampleMan record);

    List<SampleMan> selectByExample(SampleManExample example);

    SampleMan selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") SampleMan record, @Param("example") SampleManExample example);

    int updateByExample(@Param("record") SampleMan record, @Param("example") SampleManExample example);

    int updateByPrimaryKeySelective(SampleMan record);

    int updateByPrimaryKey(SampleMan record);
}