package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 部门管理控制器
 */
@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    @Resource
    private SysDepartmentMapper departmentMapper;

    /**
     * 获取部门列表
     */
    @GetMapping("/list")
    public AjaxResult<List<SysDepartment>> getDepartmentList() {
        List<SysDepartment> departments = departmentMapper.selectAll();
        return AjaxResult.successInstance(departments);
    }

    /**
     * 根据ID获取部门
     */
    @GetMapping("/{id}")
    public AjaxResult<SysDepartment> getDepartmentById(@PathVariable Long id) {
        SysDepartment department = departmentMapper.selectById(id);
        if (department != null) {
            return AjaxResult.successInstance(department);
        }
        return AjaxResult.res(0, "部门不存在", null);
    }

    /**
     * 创建部门
     */
    @PostMapping
    public AjaxResult<String> createDepartment(@RequestBody SysDepartment department) {
        int result = departmentMapper.insert(department);
        if (result > 0) {
            return AjaxResult.successInstance("创建成功");
        }
        return AjaxResult.errorInstance("创建失败");
    }

    /**
     * 更新部门
     */
    @PutMapping("/{id}")
    public AjaxResult<String> updateDepartment(@PathVariable Long id, @RequestBody SysDepartment department) {
        department.setId(id.intValue());
        int result = departmentMapper.updateById(department);
        if (result > 0) {
            return AjaxResult.successInstance("更新成功");
        }
        return AjaxResult.errorInstance("更新失败");
    }

    /**
     * 删除部门
     */
    @DeleteMapping("/{id}")
    public AjaxResult<String> deleteDepartment(@PathVariable Long id) {
        int result = departmentMapper.deleteById(id);
        if (result > 0) {
            return AjaxResult.successInstance("删除成功");
        }
        return AjaxResult.errorInstance("删除失败");
    }
}
