package com.yunsheng.yzb.service.scm.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yunsheng.yzb.mapper.scm.MaterialMapper;
import com.yunsheng.yzb.mapper.scm.ProductPriceAdjustmentMapper;
import com.yunsheng.yzb.model.ScmProductPriceAdjustment;
import com.yunsheng.yzb.model.scm.MaterialEntity;
import com.yunsheng.yzb.service.scm.ProductPriceAdjustmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductPriceAdjustmentServiceImpl implements ProductPriceAdjustmentService {

    @Autowired
    private ProductPriceAdjustmentMapper productPriceAdjustmentMapper;

    @Autowired
    private MaterialMapper materialMapper;

    @Override
    public Page<ScmProductPriceAdjustment> getProductPriceAdjustmentList(Page<ScmProductPriceAdjustment> page, Map<String, Object> params) {
        // 1. 先从 Material 表查询物资
        QueryWrapper<MaterialEntity> wrapper = new QueryWrapper<>();
        
        String materialCode = (String) params.get("materialCode");
        if (materialCode != null && !materialCode.isEmpty()) {
            wrapper.like("material_code", materialCode);
        }
        
        String name = (String) params.get("name");
        if (name != null && !name.isEmpty()) {
            wrapper.like("name", name);
        }
        
        String supplier = (String) params.get("supplier");
        if (supplier != null && !supplier.isEmpty()) {
            wrapper.like("supplier_name", supplier);
        }
        
        String manufacturer = (String) params.get("manufacturer");
        if (manufacturer != null && !manufacturer.isEmpty()) {
            wrapper.like("manufacturer", manufacturer);
        }

        Page<MaterialEntity> materialPage = materialMapper.selectPage(new Page<>(page.getCurrent(), page.getSize()), wrapper);
        
        // 2. 转换成 ScmProductPriceAdjustment 返回前端需要的格式
        List<ScmProductPriceAdjustment> records = materialPage.getRecords().stream().map(m -> {
            ScmProductPriceAdjustment adjustment = new ScmProductPriceAdjustment();
            adjustment.setProductId(m.getId()); // 物资ID
            adjustment.setMaterialCode(m.getMaterialCode());
            adjustment.setName(m.getName());
            adjustment.setMaterialType(m.getMaterialType());
            adjustment.setSpecification(m.getSpecification());
            adjustment.setModel(m.getModel());
            adjustment.setMinPackage(m.getMinPackage());
            adjustment.setUnit(m.getUnit());
            adjustment.setPurchasePrice(m.getPurchasePrice());
            adjustment.setRegistrationNumber(m.getRegistrationNumber());
            adjustment.setSupplier(m.getSupplierName());
            adjustment.setManufacturer(m.getManufacturer());
            adjustment.setCurrentPrice(m.getPurchasePrice()); // 现采购价初始为当前采购价
            return adjustment;
        }).collect(Collectors.toList());

        Page<ScmProductPriceAdjustment> result = new Page<>(materialPage.getCurrent(), materialPage.getSize(), materialPage.getTotal());
        result.setRecords(records);
        return result;
    }

    @Override
    @Transactional
    public boolean savePriceAdjustment(ScmProductPriceAdjustment adjustment) {
        // 1. 获取原物资信息，确认价格
        MaterialEntity material = materialMapper.selectById(adjustment.getProductId());
        if (material == null) {
            return false;
        }

        // 2. 补全调价历史信息
        adjustment.setMaterialCode(material.getMaterialCode());
        adjustment.setName(material.getName());
        adjustment.setMaterialType(material.getMaterialType());
        adjustment.setSpecification(material.getSpecification());
        adjustment.setModel(material.getModel());
        adjustment.setMinPackage(material.getMinPackage());
        adjustment.setUnit(material.getUnit());
        adjustment.setPurchasePrice(material.getPurchasePrice()); // 原采购价
        adjustment.setRegistrationNumber(material.getRegistrationNumber());
        adjustment.setSupplier(material.getSupplierName());
        adjustment.setManufacturer(material.getManufacturer());
        adjustment.setOldPrice(material.getPurchasePrice());
        
        adjustment.setAdjustedAt(LocalDateTime.now());
        adjustment.setCreateTime(LocalDateTime.now());
        adjustment.setUpdateTime(LocalDateTime.now());

        // 3. 记录调价历史
        int historyInserted = productPriceAdjustmentMapper.insert(adjustment);

        // 4. 同步更新物资字典表的价格
        material.setPurchasePrice(adjustment.getNewPrice());
        material.setUpdateTime(LocalDateTime.now());
        int materialUpdated = materialMapper.updateById(material);

        return historyInserted > 0 && materialUpdated > 0;
    }

    @Override
    public Page<ScmProductPriceAdjustment> getPriceAdjustmentHistory(Page<ScmProductPriceAdjustment> page) {
        QueryWrapper<ScmProductPriceAdjustment> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("adjusted_at");
        return productPriceAdjustmentMapper.selectPage(page, wrapper);
    }
}
