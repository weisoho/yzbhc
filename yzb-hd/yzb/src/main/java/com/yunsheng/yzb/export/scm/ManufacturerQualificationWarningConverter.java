package com.yunsheng.yzb.export.scm;

import com.yunsheng.yzb.export.DataConverter;
import com.yunsheng.yzb.vo.scm.ManufacturerQualificationWarningView;

/**
 * 厂商资质预警导出转换器。
 */
public class ManufacturerQualificationWarningConverter implements DataConverter<ManufacturerQualificationWarningView> {

    @Override
    public String[] convert(ManufacturerQualificationWarningView item) {
        return new String[]{
                item.getQualificationId() != null ? item.getQualificationId().toString() : "",
                item.getSupplierId() != null ? item.getSupplierId().toString() : "",
                item.getSupplierName() != null ? item.getSupplierName() : "",
                item.getManufacturer() != null ? item.getManufacturer() : "",
                item.getProductCount() != null ? item.getProductCount().toString() : "",
                item.getType() != null ? item.getType() : "",
                item.getCertificateName() != null ? item.getCertificateName() : "",
                item.getLicenseNumber() != null ? item.getLicenseNumber() : "",
                item.getExpiryDate() != null ? item.getExpiryDate().toString() : "",
                item.getStatus() != null ? item.getStatus() : ""
        };
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "资质ID", "供应商ID", "供应商名称", "生产厂家", "受影响产品数",
                "资质类型", "资质名称", "证件编号", "有效期", "状态"
        };
    }
}

