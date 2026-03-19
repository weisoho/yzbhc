package com.yunsheng.yzb.export.scm;

import com.yunsheng.yzb.export.DataConverter;
import com.yunsheng.yzb.model.scm.SupplierQualificationEntity;

/**
 * 供应商资质数据转换器。
 */
public class QualificationConverter implements DataConverter<SupplierQualificationEntity> {
    
    @Override
    public String[] convert(SupplierQualificationEntity qualification) {
        return new String[]{
            qualification.getId() != null ? qualification.getId().toString() : "",
            qualification.getSupplierId() != null ? qualification.getSupplierId().toString() : "",
            qualification.getType() != null ? qualification.getType() : "",
            qualification.getCertificateName() != null ? qualification.getCertificateName() : "",
            qualification.getLicenseNumber() != null ? qualification.getLicenseNumber() : "",
            qualification.getLicenseType() != null ? qualification.getLicenseType() : "",
            qualification.getIssueDate() != null ? qualification.getIssueDate().toString() : "",
            qualification.getExpiryDate() != null ? qualification.getExpiryDate().toString() : "",
            qualification.getIssuingAuthority() != null ? qualification.getIssuingAuthority() : "",
            qualification.getStatus() != null ? qualification.getStatus() : "",
            qualification.getAttachmentName() != null ? qualification.getAttachmentName() : ""
        };
    }
    
    @Override
    public String[] getHeaders() {
        return new String[]{
            "ID", "供应商 ID", "资质类型", "资质名称", "证件编号", "证件类别", 
            "发证日期", "有效期", "发证机构", "状态", "附件名称"
        };
    }
}
