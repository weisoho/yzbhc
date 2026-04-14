package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.model.SysDepartment;
import com.yunsheng.yzb.mapper.SysDepartmentMapper;
import com.yunsheng.yzb.utils.AjaxResult;
import com.yunsheng.yzb.utils.DepartmentTreeUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
    public AjaxResult<List<SysDepartment>> getDepartmentList(
            @RequestParam(defaultValue = "false") boolean tree,
            @RequestParam(required = false) Long roleId,
            @RequestParam(defaultValue = "true") boolean includeDescendants) {
        List<SysDepartment> departments = departmentMapper.selectAll();
        markRoleDepartments(departments, roleId, includeDescendants);
        if (tree) {
            departments = DepartmentTreeUtils.buildTree(departments);
        }
        return AjaxResult.successInstance(departments);
    }

    /**
     * 获取部门树。
     */
    @GetMapping("/tree")
    public AjaxResult<List<SysDepartment>> getDepartmentTree(
            @RequestParam(required = false) Long roleId,
            @RequestParam(defaultValue = "true") boolean includeDescendants) {
        List<SysDepartment> departments = departmentMapper.selectAll();
        markRoleDepartments(departments, roleId, includeDescendants);
        return AjaxResult.successInstance(DepartmentTreeUtils.buildTree(departments));
    }

    /**
     * 获取角色已分配部门ID列表。
     */
    @GetMapping("/role/{roleId}/selected-ids")
    public AjaxResult<Set<Long>> getRoleSelectedDepartmentIds(
            @PathVariable Long roleId,
            @RequestParam(defaultValue = "true") boolean includeDescendants) {
        List<SysDepartment> departments = departmentMapper.selectByRoleId(roleId);
        Set<Long> selectedIds = departments.stream()
                .map(dept -> dept.getId().longValue())
                .collect(Collectors.toSet());
        if (includeDescendants && !selectedIds.isEmpty()) {
            selectedIds = DepartmentTreeUtils.expandWithDescendants(selectedIds, departmentMapper.selectAll());
        }
        return AjaxResult.successInstance(selectedIds);
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
        // 自动生成部门编码（如果未提供）
        if (department.getDeptCode() == null || department.getDeptCode().trim().isEmpty()) {
            String prefix = "CAMPUS".equals(department.getOrgType()) ? "YQ" : "DEP";
            department.setDeptCode(prefix + System.currentTimeMillis());
        }
        if (department.getStatus() == null) {
            department.setStatus(1);
        }
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

    private void markRoleDepartments(List<SysDepartment> departments, Long roleId, boolean includeDescendants) {
        Set<Long> checkedIds = Collections.emptySet();
        if (roleId != null) {
            checkedIds = departmentMapper.selectByRoleId(roleId).stream()
                    .map(dept -> dept.getId().longValue())
                    .collect(Collectors.toCollection(HashSet::new));
            if (includeDescendants && !checkedIds.isEmpty()) {
                checkedIds = DepartmentTreeUtils.expandWithDescendants(checkedIds, departments);
            }
        }
        for (SysDepartment department : departments) {
            department.setChecked(checkedIds.contains(department.getId().longValue()));
        }
    }
}
