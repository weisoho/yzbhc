package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.AdverseEventRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface AdverseEventRecordMapper {

    @Select("<script>"
            + "select * from adverse_event_record where delete_flag = 0 "
            + "<if test='query.eventNo != null and query.eventNo != \"\"'> and event_no like concat('%', #{query.eventNo}, '%')</if>"
            + "<if test='query.eventName != null and query.eventName != \"\"'> and event_name like concat('%', #{query.eventName}, '%')</if>"
            + "<if test='query.patientName != null and query.patientName != \"\"'> and patient_name like concat('%', #{query.patientName}, '%')</if>"
            + "<if test='query.involvedProject != null and query.involvedProject != \"\"'> and involved_project like concat('%', #{query.involvedProject}, '%')</if>"
            + "<if test='query.startDate != null'> and occurrence_date <![CDATA[>=]]> #{query.startDate}</if>"
            + "<if test='query.endDate != null'> and occurrence_date <![CDATA[<=]]> #{query.endDate}</if>"
            + "order by occurrence_date desc, id desc"
            + "</script>")
    List<AdverseEventRecord> selectPage(@Param("query") AdverseEventRecord query);

    @Select("select * from adverse_event_record where id = #{id} and delete_flag = 0")
    AdverseEventRecord selectById(@Param("id") Long id);

    @Select("select event_no from adverse_event_record order by id desc limit 1")
    String selectLatestNo();

    @Insert("insert into adverse_event_record(event_no, patient_name, gender, age, patient_id, hospitalization_no, involved_project, event_name, occurrence_date, event_summary, investigation_situation, event_analysis, event_summary_detail, handling_result, rectification_measures, attachment, recorder_id, recorder_name, create_time, update_time, delete_flag) values (#{eventNo}, #{patientName}, #{gender}, #{age}, #{patientId}, #{hospitalizationNo}, #{involvedProject}, #{eventName}, #{occurrenceDate}, #{eventSummary}, #{investigationSituation}, #{eventAnalysis}, #{eventSummaryDetail}, #{handlingResult}, #{rectificationMeasures}, #{attachment}, #{recorderId}, #{recorderName}, #{createTime}, #{updateTime}, #{deleteFlag})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(AdverseEventRecord record);

    @Update("update adverse_event_record set patient_name = #{patientName}, gender = #{gender}, age = #{age}, patient_id = #{patientId}, hospitalization_no = #{hospitalizationNo}, involved_project = #{involvedProject}, event_name = #{eventName}, occurrence_date = #{occurrenceDate}, event_summary = #{eventSummary}, investigation_situation = #{investigationSituation}, event_analysis = #{eventAnalysis}, event_summary_detail = #{eventSummaryDetail}, handling_result = #{handlingResult}, rectification_measures = #{rectificationMeasures}, attachment = #{attachment}, update_time = #{updateTime} where id = #{id} and delete_flag = 0")
    int updateById(AdverseEventRecord record);

    @Update("update adverse_event_record set delete_flag = 1, update_time = #{updateTime} where id = #{id} and delete_flag = 0")
    int deleteById(AdverseEventRecord record);
}