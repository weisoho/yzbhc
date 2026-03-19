package com.yunsheng.yzb.export.scm;

import com.yunsheng.yzb.export.DataConverter;
import com.yunsheng.yzb.model.scm.SupplierEntity;

/**
 * 简约版供应商转换器（仅包含核心字段）。
 * 适用于快速导出场景。
 */
public class SimpleSupplierConverter implements DataConverter<SupplierEntity> {
    
    @Override
    public String[] convert(SupplierEntity supplier) {
        return new String[]{
            supplier.getSupplierCode() != null ? supplier.getSupplierCode() : "",
            supplier.getName() != null ? supplier.getName() : "",
            supplier.getEnterpriseType() != null ? supplier.getEnterpriseType() : "",
            supplier.getContactPerson() != null ? supplier.getContactPerson() : "",
            supplier.getContactPhone() != null ? supplier.getContactPhone() : "",
            supplier.getStatus() != null ? supplier.getStatus() : ""
        };
    }
    
    @Override
    public String[] getHeaders() {
        return new String[]{
            "供应商编码", "供应商名称", "企业类型", "联系人", "联系电话", "状态"
        };
    }
}
