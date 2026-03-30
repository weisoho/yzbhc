package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AssetChangeRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface AssetChangeRecordMapper {

    @Select("<script>"
            + "select acr.*, a.asset_typename as assetTypeName, a.dep_name as depName "
            + "from asset_change_record acr "
            + "left join asset a on a.id = acr.asset_id "
            + "where acr.delete_flag = 0 "
            + "<if test='query.changeType != null and query.changeType != \"\"'> and acr.change_type = #{query.changeType}</if>"
            + "<if test='query.assetCode != null and query.assetCode != \"\"'> and acr.asset_code like concat('%', #{query.assetCode}, '%')</if>"
            + "<if test='query.assetName != null and query.assetName != \"\"'> and acr.asset_name like concat('%', #{query.assetName}, '%')</if>"
            + "<if test='query.auditStatus != null'> and acr.audit_status = #{query.auditStatus}</if>"
            + "<if test='query.assetId != null'> and acr.asset_id = #{query.assetId}</if>"
            + "<if test='query.startDate != null'> and acr.apply_date <![CDATA[>=]]> #{query.startDate}</if>"
            + "<if test='query.endDate != null'> and acr.apply_date <![CDATA[<=]]> #{query.endDate}</if>"
            + "order by acr.apply_date desc, acr.id desc"
            + "</script>")
    List<AssetChangeRecord> selectPage(@Param("query") AssetChangeRecord query);

    @Select("select * from asset_change_record where id = #{id} and delete_flag = 0")
    AssetChangeRecord selectById(@Param("id") Integer id);

    @Select("select change_code from asset_change_record order by id desc limit 1")
    String selectLatestCode();

    @Insert("insert into asset_change_record(change_code, asset_id, asset_code, asset_name, change_type, old_value, new_value, change_reason, change_date, applicant_id, applicant_name, apply_date, audit_status, auditor_id, auditor_name, audit_date, audit_remark, execute_status, executor_name, execute_date, scrap_value, remark, delete_flag) values (#{changeCode}, #{assetId}, #{assetCode}, #{assetName}, #{changeType}, #{oldValue}, #{newValue}, #{changeReason}, #{changeDate}, #{applicantId}, #{applicantName}, #{applyDate}, #{auditStatus}, #{auditorId}, #{auditorName}, #{auditDate}, #{auditRemark}, #{executeStatus}, #{executorName}, #{executeDate}, #{scrapValue}, #{remark}, #{deleteFlag})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(AssetChangeRecord record);

    @Update("update asset_change_record set audit_status = #{auditStatus}, auditor_id = #{auditorId}, auditor_name = #{auditorName}, audit_date = #{auditDate}, audit_remark = #{auditRemark}, execute_status = #{executeStatus}, executor_name = #{executorName}, execute_date = #{executeDate}, remark = #{remark} where id = #{id}")
    int updateAudit(AssetChangeRecord record);

    @Update("update asset_change_record set delete_flag = 1, audit_status = #{auditStatus}, audit_remark = #{auditRemark}, auditor_id = #{auditorId}, auditor_name = #{auditorName}, audit_date = #{auditDate} where id = #{id}")
    int revoke(AssetChangeRecord record);
}