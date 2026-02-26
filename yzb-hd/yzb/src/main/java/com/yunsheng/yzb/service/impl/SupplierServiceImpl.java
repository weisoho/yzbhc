package com.yunsheng.yzb.service.impl;

import com.yunsheng.yzb.mapper.SupplierMapper;
import com.yunsheng.yzb.mapper.SupplierQualificationMapper;
import com.yunsheng.yzb.model.Supplier;
import com.yunsheng.yzb.model.SupplierQualification;
import com.yunsheng.yzb.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 供应商管理服务实现类
 */
@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierMapper supplierMapper;

    @Autowired
    private SupplierQualificationMapper qualificationMapper;

    /**
     * 获取所有供应商列表
     * 支持根据名称模糊查询
     */
    @Override
    public List<Supplier> getAllSuppliers(String name) {
        return supplierMapper.selectAll(name);
    }

    /**
     * 根据ID获取供应商详情
     */
    @Override
    public Supplier getSupplierById(Integer id) {
        return supplierMapper.selectByPrimaryKey(id);
    }

    /**
     * 新增供应商
     * 使用 insertSelective 以支持默认值
     */
    @Override
    public int addSupplier(Supplier supplier) {
        return supplierMapper.insertSelective(supplier);
    }

    /**
     * 更新供应商信息
     * 只更新非空字段
     */
    @Override
    public int updateSupplier(Supplier supplier) {
        return supplierMapper.updateByPrimaryKeySelective(supplier);
    }

    /**
     * 删除供应商
     * 注意：实际业务中可能需要检查是否存在关联数据
     */
    @Override
    public int deleteSupplier(Integer id) {
        return supplierMapper.deleteByPrimaryKey(id);
    }

    /**
     * 获取供应商资质列表
     * 根据供应商ID和资质类型筛选
     */
    @Override
    public List<SupplierQualification> getQualifications(Integer supplierId, String type) {
        return qualificationMapper.selectBySupplierAndType(supplierId, type);
    }

    /**
     * 根据ID获取资质详情
     */
    @Override
    public SupplierQualification getQualificationById(Integer id) {
        return qualificationMapper.selectByPrimaryKey(id);
    }

    /**
     * 新增资质
     */
    @Override
    public int addQualification(SupplierQualification qualification) {
        return qualificationMapper.insertSelective(qualification);
    }

    /**
     * 更新资质信息
     */
    @Override
    public int updateQualification(SupplierQualification qualification) {
        return qualificationMapper.updateByPrimaryKeySelective(qualification);
    }

    /**
     * 删除资质
     */
    @Override
    public int deleteQualification(Integer id) {
        return qualificationMapper.deleteByPrimaryKey(id);
    }
}
