package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.YsUserExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface YsUserMapper {
    int countByExample(YsUserExample example);

    int deleteByExample(YsUserExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(YsUser record);

    int insertSelective(YsUser record);

    List<YsUser> selectByExample(YsUserExample example);

    YsUser selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") YsUser record, @Param("example") YsUserExample example);

    int updateByExample(@Param("record") YsUser record, @Param("example") YsUserExample example);

    int updateByPrimaryKeySelective(YsUser record);

    int updateByPrimaryKey(YsUser record);
}
