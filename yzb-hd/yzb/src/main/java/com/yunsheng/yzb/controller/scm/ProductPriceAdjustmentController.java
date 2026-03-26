package com.yunsheng.yzb.controller.scm;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.common.Result;
import com.yunsheng.yzb.model.ScmProductPriceAdjustment;
import com.yunsheng.yzb.service.scm.ProductPriceAdjustmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scm/product-price-adjustment")
public class ProductPriceAdjustmentController {

    @Autowired
    private ProductPriceAdjustmentService productPriceAdjustmentService;

    // 获取物资调价列表
    @GetMapping
    public Result getProductPriceAdjustmentList(
            @RequestParam(required = false) String materialCode,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String supplier,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<ScmProductPriceAdjustment> page = new Page<>(pageNum, pageSize);
        Map<String, Object> params = new HashMap<>();
        params.put("materialCode", materialCode);
        params.put("name", name);
        params.put("supplier", supplier);
        params.put("manufacturer", manufacturer);
        
        Page<ScmProductPriceAdjustment> result = productPriceAdjustmentService.getProductPriceAdjustmentList(page, params);
        return Result.success(result);
    }

    // 保存调价记录
    @PostMapping
    public Result savePriceAdjustment(@RequestBody ScmProductPriceAdjustment adjustment) {
        String validationMessage = validateAdjustmentReason(adjustment);
        if (validationMessage != null) {
            return Result.error(validationMessage);
        }

        boolean success = productPriceAdjustmentService.savePriceAdjustment(adjustment);
        if (success) {
            return Result.success("调价成功");
        } else {
            return Result.error("调价失败");
        }
    }

    private String validateAdjustmentReason(ScmProductPriceAdjustment adjustment) {
        if (adjustment == null || !StringUtils.hasText(adjustment.getAdjustmentReason())) {
            return "调价原因不能为空";
        }

        String reason = adjustment.getAdjustmentReason().trim();
        adjustment.setAdjustmentReason(reason);

        if ("其他原因".equals(reason)) {
            return "选择其他原因时必须填写具体原因";
        }

        if (reason.startsWith("其他原因")) {
            String detail = reason.substring("其他原因".length()).trim();
            if (detail.startsWith(":") || detail.startsWith("：")) {
                detail = detail.substring(1).trim();
            }
            if (!StringUtils.hasText(detail)) {
                return "选择其他原因时必须填写具体原因";
            }
        }

        return null;
    }

    // 获取调价历史
    @GetMapping("/history")
    public Result getPriceAdjustmentHistory(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<ScmProductPriceAdjustment> page = new Page<>(pageNum, pageSize);
        Page<ScmProductPriceAdjustment> result = productPriceAdjustmentService.getPriceAdjustmentHistory(page);
        return Result.success(result);
    }
}
