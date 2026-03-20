package com.yunsheng.yzb.export.scm;

import com.yunsheng.yzb.export.DataConverter;
import com.yunsheng.yzb.model.scm.SupplierEntity;

/**
 * 供应商数据转换器。
 * 将 SupplierEntity 转换为可导出的数据行。
 */
public class SupplierConverter implements DataConverter<SupplierEntity> {
    
    @Override
    public String[] convert(SupplierEntity supplier) {
        return new String[]{
            supplier.getSupplierCode() != null ? supplier.getSupplierCode() : "",
            supplier.getName() != null ? supplier.getName() : "",
            supplier.getEnterpriseType() != null ? supplier.getEnterpriseType() : "",
            supplier.getCreditCode() != null ? supplier.getCreditCode() : "",
            supplier.getLegalRepresentative() != null ? supplier.getLegalRepresentative() : "",
            supplier.getRegisteredCapital() != null ? supplier.getRegisteredCapital() : "",
            supplier.getRegistrationDate() != null ? supplier.getRegistrationDate().toString() : "",
            supplier.getContactPhone() != null ? supplier.getContactPhone() : "",
            supplier.getAddress() != null ? supplier.getAddress() : ""
        };
    }
    
    @Override
    public String[] getHeaders() {
        return new String[]{
            "供应商编码", "供应商名称", "企业类型", "统一社会信用代码", "法定代表人", 
            "注册资本", "注册时间", "联系电话", "联系地址"
        };
    }
}
