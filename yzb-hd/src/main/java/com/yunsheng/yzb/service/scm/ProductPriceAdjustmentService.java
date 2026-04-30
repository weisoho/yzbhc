package com.yunsheng.yzb.service.scm;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.model.ScmProductPriceAdjustment;

import java.util.Map;

public interface ProductPriceAdjustmentService {

    Page<ScmProductPriceAdjustment> getProductPriceAdjustmentList(Page<ScmProductPriceAdjustment> page, Map<String, Object> params);

    boolean savePriceAdjustment(ScmProductPriceAdjustment adjustment);

    Page<ScmProductPriceAdjustment> getPriceAdjustmentHistory(Page<ScmProductPriceAdjustment> page);
}
