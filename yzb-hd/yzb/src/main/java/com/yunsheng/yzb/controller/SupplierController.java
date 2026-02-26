package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.model.Supplier;
import com.yunsheng.yzb.model.SupplierQualification;
import com.yunsheng.yzb.service.SupplierService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 供应商及资质管理控制器
 * 提供供应商的增删改查及相关资质的管理接口
 */
@RestController
@RequestMapping("/supplier")
public class SupplierController {

    @Resource
    private SupplierService supplierService;

    // ================== 供应商管理接口 ==================

    /**
     * 获取供应商列表
     * @param name 供应商名称（可选，支持模糊查询）
     * @return 供应商列表
     */
    @GetMapping("/list")
    public AjaxResult list(@RequestParam(required = false) String name) {
        List<Supplier> list = supplierService.getAllSuppliers(name);
        return AjaxResult.success(list);
    }

    /**
     * 获取供应商详情
     * @param id 供应商ID
     * @return 供应商详情对象
     */
    @GetMapping("/{id}")
    public AjaxResult getInfo(@PathVariable("id") Integer id) {
        return AjaxResult.success(supplierService.getSupplierById(id));
    }

    /**
     * 新增供应商
     * @param supplier 供应商对象
     * @return 成功返回1
     */
    @PostMapping("/add")
    public AjaxResult add(@RequestBody Supplier supplier) {
        return AjaxResult.success(supplierService.addSupplier(supplier));
    }

    /**
     * 编辑供应商
     * @param supplier 供应商对象（需包含ID）
     * @return 成功返回1
     */
    @PutMapping("/edit")
    public AjaxResult edit(@RequestBody Supplier supplier) {
        return AjaxResult.success(supplierService.updateSupplier(supplier));
    }

    /**
     * 删除供应商
     * @param id 供应商ID
     * @return 成功返回1
     */
    @DeleteMapping("/{id}")
    public AjaxResult remove(@PathVariable Integer id) {
        return AjaxResult.success(supplierService.deleteSupplier(id));
    }

    // ================== 供应商资质管理接口 ==================

    /**
     * 获取资质列表
     * @param supplierId 供应商ID（可选）
     * @param type 资质类型（必填，如：BUSINESS_LICENSE）
     * @return 资质列表
     */
    @GetMapping("/qualification/list")
    public AjaxResult qualificationList(@RequestParam(required = false) Integer supplierId, @RequestParam String type) {
        List<SupplierQualification> list = supplierService.getQualifications(supplierId, type);
        return AjaxResult.success(list);
    }

    /**
     * 获取资质详情
     * @param id 资质ID
     * @return 资质详情对象
     */
    @GetMapping("/qualification/{id}")
    public AjaxResult getQualificationInfo(@PathVariable("id") Integer id) {
        return AjaxResult.success(supplierService.getQualificationById(id));
    }

    /**
     * 新增资质
     * @param qualification 资质对象
     * @return 成功返回1
     */
    @PostMapping("/qualification/add")
    public AjaxResult addQualification(@RequestBody SupplierQualification qualification) {
        return AjaxResult.success(supplierService.addQualification(qualification));
    }

    /**
     * 编辑资质
     * @param qualification 资质对象（需包含ID）
     * @return 成功返回1
     */
    @PutMapping("/qualification/edit")
    public AjaxResult editQualification(@RequestBody SupplierQualification qualification) {
        return AjaxResult.success(supplierService.updateQualification(qualification));
    }

    /**
     * 删除资质
     * @param id 资质ID
     * @return 成功返回1
     */
    @DeleteMapping("/qualification/{id}")
    public AjaxResult removeQualification(@PathVariable Integer id) {
        return AjaxResult.success(supplierService.deleteQualification(id));
    }
}
