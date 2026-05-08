package com.yunsheng.yzb.service.scm;

import com.yunsheng.yzb.vo.TransferOrderVO;
import com.yunsheng.yzb.vo.TransferAcceptanceItemVO;
import com.yunsheng.yzb.vo.TransferAcceptanceSave;
import com.yunsheng.yzb.vo.TransferOrderCreateSave;

import java.util.List;
import java.util.Map;

/**
 * 调拨管理服务。
 */
public interface TransferManagementService {

    /**
     * 查询调拨单列表。
     *
     * @param transferNumber 调拨单号
     * @param fromWarehouse 调出仓库
     * @param toWarehouse 调入仓库
     * @param pageNum 页码
     * @param pageSize 每页大小
     * @return 调拨单列表和总数
     */
    Map<String, Object> getTransferOrders(String transferNumber, String fromWarehouse, String toWarehouse, int pageNum, int pageSize);

    /**
     * 创建调拨单。
     */
    Map<String, Object> createTransferOrder(TransferOrderCreateSave request);

    /**
     * 查询所有仓库列表。
     *
     * @return 仓库列表
     */
    List<Map<String, String>> getWarehouseList();

    Map<String, Object> getTransferAcceptanceOrders(String transferNumber,
                                                    String fromWarehouse,
                                                    String toWarehouse,
                                                    String acceptanceStatus,
                                                    String startDate,
                                                    String endDate,
                                                    int pageNum,
                                                    int pageSize);

    List<TransferAcceptanceItemVO> getTransferAcceptanceDetail(String transferNumber);

    Map<String, Object> acceptTransfer(String transferNumber, List<TransferAcceptanceSave.Item> items, String acceptor, String acceptanceDate);

    Map<String, Object> rejectTransfer(String transferNumber, List<TransferAcceptanceSave.Item> items, String acceptor, String acceptanceDate);
}
