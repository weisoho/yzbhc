package com.yunsheng.yzb.mapper.scm;

import com.yunsheng.yzb.vo.TransferAcceptanceItemVO;
import com.yunsheng.yzb.vo.TransferAcceptanceVO;
import com.yunsheng.yzb.vo.TransferOrderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 调拨单扩展 Mapper，用于查询关联数据。
 */
@Mapper
public interface TransferOrderExtMapper {

    /**
     * 查询调拨单列表，包含明细信息
     */
    @Select("SELECT toi.id, t.transfer_number as transferNumber, toi.supplier as supplierName, toi.material_code as materialCode, toi.material_name as materialName, m.material_type as materialType, toi.specification, toi.model, toi.registration_number as registrationNumber, toi.manufacturer, toi.batch_number as batchNumber, toi.production_date as productionDate, toi.expiry_date as expiryDate, t.from_department_name as fromWarehouse, t.to_department_name as toWarehouse, t.from_department_name as departmentName, m.purchase_price as purchaseAmount, toi.transfer_quantity as quantity, toi.unit, t.transfer_date as transferDate, t.operator_name as transferor, t.status FROM scm_transfer_order t JOIN scm_transfer_order_item toi ON t.id = toi.transfer_order_id LEFT JOIN scm_material m ON m.id = toi.material_id WHERE 1=1 AND (t.transfer_number LIKE CONCAT('%', #{transferNumber}, '%') OR #{transferNumber} IS NULL OR #{transferNumber} = '') AND (t.from_department_name = #{fromWarehouse} OR #{fromWarehouse} = 'all' OR #{fromWarehouse} IS NULL OR #{fromWarehouse} = '') AND (t.to_department_name = #{toWarehouse} OR #{toWarehouse} = 'all' OR #{toWarehouse} IS NULL OR #{toWarehouse} = '') ORDER BY t.transfer_date DESC, t.id DESC, toi.id ASC LIMIT #{offset}, #{limit}")
    List<TransferOrderVO> selectTransferOrderList(
            @Param("transferNumber") String transferNumber,
            @Param("fromWarehouse") String fromWarehouse,
            @Param("toWarehouse") String toWarehouse,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    /**
     * 查询调拨单总数
     */
    @Select("SELECT COUNT(*) FROM scm_transfer_order t JOIN scm_transfer_order_item toi ON t.id = toi.transfer_order_id WHERE 1=1 AND (t.transfer_number LIKE CONCAT('%', #{transferNumber}, '%') OR #{transferNumber} IS NULL OR #{transferNumber} = '') AND (t.from_department_name = #{fromWarehouse} OR #{fromWarehouse} = 'all' OR #{fromWarehouse} IS NULL OR #{fromWarehouse} = '') AND (t.to_department_name = #{toWarehouse} OR #{toWarehouse} = 'all' OR #{toWarehouse} IS NULL OR #{toWarehouse} = '')")
    int selectTransferOrderCount(
            @Param("transferNumber") String transferNumber,
            @Param("fromWarehouse") String fromWarehouse,
            @Param("toWarehouse") String toWarehouse
    );

    @Select("SELECT toi.id, t.transfer_number as transferNumber, toi.material_name as materialName, toi.specification, t.from_department_name as fromWarehouse, t.to_department_name as toWarehouse, toi.transfer_quantity as quantity, toi.unit, t.transfer_date as transferDate, t.operator_name as transferor, toi.acceptance_status as acceptanceStatus, toi.accepted_quantity as acceptedQuantity, toi.acceptor, toi.acceptance_date as acceptanceDate FROM scm_transfer_order t JOIN scm_transfer_order_item toi ON t.id = toi.transfer_order_id WHERE 1=1 AND (t.transfer_number LIKE CONCAT('%', #{transferNumber}, '%') OR #{transferNumber} IS NULL OR #{transferNumber} = '') AND (t.from_department_name = #{fromWarehouse} OR #{fromWarehouse} = 'all' OR #{fromWarehouse} IS NULL OR #{fromWarehouse} = '') AND (t.to_department_name = #{toWarehouse} OR #{toWarehouse} = 'all' OR #{toWarehouse} IS NULL OR #{toWarehouse} = '') AND (toi.acceptance_status = #{acceptanceStatus} OR #{acceptanceStatus} = 'all' OR #{acceptanceStatus} IS NULL OR #{acceptanceStatus} = '') AND (t.transfer_date >= #{startDate} OR #{startDate} IS NULL OR #{startDate} = '') AND (t.transfer_date <= #{endDate} OR #{endDate} IS NULL OR #{endDate} = '') ORDER BY t.transfer_date DESC, t.id DESC, toi.id ASC LIMIT #{offset}, #{limit}")
    List<TransferAcceptanceVO> selectTransferAcceptanceList(
            @Param("transferNumber") String transferNumber,
            @Param("fromWarehouse") String fromWarehouse,
            @Param("toWarehouse") String toWarehouse,
            @Param("acceptanceStatus") String acceptanceStatus,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    @Select("SELECT COUNT(*) FROM scm_transfer_order t JOIN scm_transfer_order_item toi ON t.id = toi.transfer_order_id WHERE 1=1 AND (t.transfer_number LIKE CONCAT('%', #{transferNumber}, '%') OR #{transferNumber} IS NULL OR #{transferNumber} = '') AND (t.from_department_name = #{fromWarehouse} OR #{fromWarehouse} = 'all' OR #{fromWarehouse} IS NULL OR #{fromWarehouse} = '') AND (t.to_department_name = #{toWarehouse} OR #{toWarehouse} = 'all' OR #{toWarehouse} IS NULL OR #{toWarehouse} = '') AND (toi.acceptance_status = #{acceptanceStatus} OR #{acceptanceStatus} = 'all' OR #{acceptanceStatus} IS NULL OR #{acceptanceStatus} = '') AND (t.transfer_date >= #{startDate} OR #{startDate} IS NULL OR #{startDate} = '') AND (t.transfer_date <= #{endDate} OR #{endDate} IS NULL OR #{endDate} = '')")
    int selectTransferAcceptanceCount(
            @Param("transferNumber") String transferNumber,
            @Param("fromWarehouse") String fromWarehouse,
            @Param("toWarehouse") String toWarehouse,
            @Param("acceptanceStatus") String acceptanceStatus,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

    @Select("SELECT toi.id, toi.material_name as materialName, toi.specification, toi.batch_number as batchNumber, toi.transfer_quantity as quantity, toi.unit, toi.production_date as productionDate, toi.expiry_date as expiryDate, toi.acceptance_status as acceptanceStatus, toi.accepted_quantity as acceptedQuantity, toi.acceptor, toi.acceptance_date as acceptanceDate FROM scm_transfer_order t JOIN scm_transfer_order_item toi ON t.id = toi.transfer_order_id WHERE t.transfer_number = #{transferNumber} ORDER BY toi.id ASC")
    List<TransferAcceptanceItemVO> selectTransferAcceptanceDetail(@Param("transferNumber") String transferNumber);
}
