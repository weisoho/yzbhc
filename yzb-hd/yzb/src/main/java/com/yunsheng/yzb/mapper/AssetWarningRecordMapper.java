package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetWarningRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AssetWarningRecordMapper {

    @Select("select * from asset_warning_record where asset_id = #{assetId} and warning_type = #{warningType} limit 1")
    AssetWarningRecord selectOne(@Param("assetId") Integer assetId, @Param("warningType") String warningType);

    @Insert("insert into asset_warning_record(asset_id, asset_code, asset_name, warning_type, warning_level, warning_date, due_date, days_left, status, description, action_required, handler_id, handler_name, handle_time, remark) values (#{assetId}, #{assetCode}, #{assetName}, #{warningType}, #{warningLevel}, #{warningDate}, #{dueDate}, #{daysLeft}, #{status}, #{description}, #{actionRequired}, #{handlerId}, #{handlerName}, #{handleTime}, #{remark}) on duplicate key update asset_code = values(asset_code), asset_name = values(asset_name), warning_level = values(warning_level), warning_date = values(warning_date), due_date = values(due_date), days_left = values(days_left), status = values(status), description = values(description), action_required = values(action_required), handler_id = values(handler_id), handler_name = values(handler_name), handle_time = values(handle_time), remark = values(remark)")
    int upsert(AssetWarningRecord record);
}