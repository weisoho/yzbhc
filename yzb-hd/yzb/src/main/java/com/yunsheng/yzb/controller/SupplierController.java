package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.model.Supplier;
import com.yunsheng.yzb.model.SupplierQualification;
import com.yunsheng.yzb.service.SupplierService;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 供应商管理
 */
@RestController
@RequestMapping("/supplier")
public class SupplierController {

    @Resource
    private SupplierService supplierService;

    // ================== 供应商管理接口 ==================

    /**
     * 获取供应商列表
     * 支持按供应商名称、联系人、联系电话模糊查询
     * @param name 供应商名称（可选，模糊查询）
     * @param contactPerson 联系人（可选，模糊查询）
     * @param contactPhone 联系电话（可选，模糊查询）
     * @return 供应商列表
     */
    @GetMapping("/list")
    public AjaxResult<List<Supplier>> list(@RequestParam(required = false) String name,
                        @RequestParam(required = false) String contactPerson,
                        @RequestParam(required = false) String contactPhone) {
        List<Supplier> list = supplierService.getSuppliersByCondition(name, contactPerson, contactPhone);
        return AjaxResult.success(list);
    }

    /**
     * 获取供应商详情
     * @param id 供应商ID
     * @return 供应商详情对象
     */
    @GetMapping("/{id}")
    public AjaxResult<Supplier> getInfo(@PathVariable Integer id) {
        return AjaxResult.success(supplierService.getSupplierById(id));
    }

    /**
     * 新增供应商
     * @param supplier 供应商对象，包含以下字段：
     *               - name: 供应商名称（必填）
     *               - contactPerson: 联系人（可选）
     *               - contactPhone: 联系电话（可选）
     *               - address: 地址（可选）
     *               - registrationNumber: 注册证号（可选）
     *               - creditCode: 企业信用代码（可选）
     *               - taxNumber: 企业税号（可选）
     *               - supplierCode: 院内供应商编码（可选，系统自动生成）
     *               - enterpriseType: 企业类型（可选，默认为"经营企业"）
     * @return 成功返回1
     */
    @PostMapping("/add")
    public AjaxResult<Integer> add(@RequestBody Supplier supplier) {
        return AjaxResult.success(supplierService.addSupplier(supplier));
    }

    /**
     * 编辑供应商
     * @param supplier 供应商对象，需包含ID
     * @return 成功返回1
     */
    @PutMapping("/edit")
    public AjaxResult<Integer> edit(@RequestBody Supplier supplier) {
        return AjaxResult.success(supplierService.updateSupplier(supplier));
    }

    /**
     * 删除供应商
     * @param id 供应商ID
     * @return 成功返回1
     */
    @DeleteMapping("/{id}")
    public AjaxResult<Integer> remove(@PathVariable Integer id) {
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
    public AjaxResult<List<SupplierQualification>> qualificationList(@RequestParam(required = false) Integer supplierId, @RequestParam String type) {
        List<SupplierQualification> list = supplierService.getQualifications(supplierId, type);
        return AjaxResult.success(list);
    }

    /**
     * 获取资质详情
     * @param id 资质ID
     * @return 资质详情对象
     */
    @GetMapping("/qualification/{id}")
    public AjaxResult<SupplierQualification> getQualificationInfo(@PathVariable Integer id) {
        return AjaxResult.success(supplierService.getQualificationById(id));
    }

    /**
     * 新增资质
     * @param qualification 资质对象
     * @return 成功返回1
     */
    @PostMapping("/qualification/add")
    public AjaxResult<Integer> addQualification(@RequestBody SupplierQualification qualification) {
        return AjaxResult.success(supplierService.addQualification(qualification));
    }

    /**
     * 编辑资质
     * @param qualification 资质对象（需包含ID）
     * @return 成功返回1
     */
    @PutMapping("/qualification/edit")
    public AjaxResult<Integer> editQualification(@RequestBody SupplierQualification qualification) {
        return AjaxResult.success(supplierService.updateQualification(qualification));
    }

    /**
     * 删除资质
     * @param id 资质ID
     * @return 成功返回1
     */
    @DeleteMapping("/qualification/{id}")
    public AjaxResult<Integer> removeQualification(@PathVariable Integer id) {
        return AjaxResult.success(supplierService.deleteQualification(id));
    }
}
