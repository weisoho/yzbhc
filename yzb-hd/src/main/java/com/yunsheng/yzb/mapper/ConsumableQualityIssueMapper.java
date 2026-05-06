package com.yunsheng.yzb.mapper;

import com.yunsheng.yzb.model.ConsumableQualityIssue;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ConsumableQualityIssueMapper {

    @Select("<script>"
            + "select * from consumable_quality_issue where delete_flag = 0 "
            + "<if test='query.issueNo != null and query.issueNo != \"\"'> and issue_no like concat('%', #{query.issueNo}, '%')</if>"
            + "<if test='query.materialCode != null and query.materialCode != \"\"'> and material_code like concat('%', #{query.materialCode}, '%')</if>"
            + "<if test='query.materialName != null and query.materialName != \"\"'> and material_name like concat('%', #{query.materialName}, '%')</if>"
            + "<if test='query.batchNumber != null and query.batchNumber != \"\"'> and batch_number like concat('%', #{query.batchNumber}, '%')</if>"
            + "<if test='query.supplier != null and query.supplier != \"\"'> and supplier_name like concat('%', #{query.supplier}, '%')</if>"
            + "<if test='query.manufacturer != null and query.manufacturer != \"\"'> and manufacturer like concat('%', #{query.manufacturer}, '%')</if>"
            + "<if test='query.status != null'> and status = #{query.status}</if>"
            + "<if test='query.startDate != null'> and occurrence_date <![CDATA[>=]]> #{query.startDate}</if>"
            + "<if test='query.endDate != null'> and occurrence_date <![CDATA[<=]]> #{query.endDate}</if>"
            + "order by occurrence_date desc, id desc"
            + "</script>")
    List<ConsumableQualityIssue> selectPage(@Param("query") ConsumableQualityIssue query);

    @Select("select * from consumable_quality_issue where id = #{id} and delete_flag = 0")
    ConsumableQualityIssue selectById(@Param("id") Long id);

    @Select("select issue_no from consumable_quality_issue order by id desc limit 1")
    String selectLatestNo();

    @Insert("insert into consumable_quality_issue(issue_no, inventory_id, material_id, material_code, material_name, specification, model, registration_number, manufacturer, supplier_name, batch_number, production_date, expiry_date, quantity, occurrence_date, status, issue_description, attachment, creator_id, creator_name, create_time, update_time, delete_flag) values (#{issueNo}, #{inventoryId}, #{materialId}, #{materialCode}, #{materialName}, #{specification}, #{model}, #{registrationNumber}, #{manufacturer}, #{supplierName}, #{batchNumber}, #{productionDate}, #{expiryDate}, #{quantity}, #{occurrenceDate}, #{status}, #{issueDescription}, #{attachment}, #{creatorId}, #{creatorName}, #{createTime}, #{updateTime}, #{deleteFlag})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ConsumableQualityIssue record);

    @Update("update consumable_quality_issue set occurrence_date = #{occurrenceDate}, status = #{status}, issue_description = #{issueDescription}, attachment = #{attachment}, update_time = #{updateTime} where id = #{id} and delete_flag = 0")
    int updateEditable(ConsumableQualityIssue record);

    @Update("update consumable_quality_issue set delete_flag = 1, update_time = #{updateTime} where id = #{id} and delete_flag = 0")
    int deleteById(ConsumableQualityIssue record);
}