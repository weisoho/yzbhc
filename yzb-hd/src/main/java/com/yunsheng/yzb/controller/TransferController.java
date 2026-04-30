package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.service.scm.TransferManagementService;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.vo.TransferAcceptanceSave;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Map;

@RestController
@RequestMapping("/api/scm/transfer")
public class TransferController {

    @Resource
    private TransferManagementService transferManagementService;

    @GetMapping("/orders")
    public AjaxResult getTransferOrders(
            @RequestParam(required = false) String transferNumber,
            @RequestParam(required = false) String fromWarehouse,
            @RequestParam(required = false) String toWarehouse,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {

        // 调用服务查询调拨单列表
        Map<String, Object> data = transferManagementService.getTransferOrders(
                transferNumber, fromWarehouse, toWarehouse, pageNum, pageSize
        );

        return AjaxResult.success(data);
    }

    @GetMapping("/warehouses")
    public AjaxResult getWarehouseList() {
        // 调用服务查询仓库列表
        return AjaxResult.success(transferManagementService.getWarehouseList());
    }

    @GetMapping("/acceptance")
    public AjaxResult getTransferAcceptanceOrders(
            @RequestParam(required = false) String transferNumber,
            @RequestParam(required = false) String fromWarehouse,
            @RequestParam(required = false) String toWarehouse,
            @RequestParam(required = false) String acceptanceStatus,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        Map<String, Object> data = transferManagementService.getTransferAcceptanceOrders(
                transferNumber, fromWarehouse, toWarehouse, acceptanceStatus, startDate, endDate, pageNum, pageSize
        );
        return AjaxResult.success(data);
    }

    @GetMapping("/acceptance/detail/{transferNumber}")
    public AjaxResult getTransferAcceptanceDetail(@PathVariable String transferNumber) {
        return AjaxResult.success(transferManagementService.getTransferAcceptanceDetail(transferNumber));
    }

    @PostMapping("/acceptance/accept")
    public AjaxResult acceptTransfer(@RequestBody TransferAcceptanceSave request) {
        return AjaxResult.success(transferManagementService.acceptTransfer(
                request.getTransferNumber(), request.getItems(), request.getAcceptor(), request.getAcceptanceDate()
        ));
    }

    @PostMapping("/acceptance/reject")
    public AjaxResult rejectTransfer(@RequestBody TransferAcceptanceSave request) {
        return AjaxResult.success(transferManagementService.rejectTransfer(
                request.getTransferNumber(), request.getItems(), request.getAcceptor(), request.getAcceptanceDate()
        ));
    }
}
