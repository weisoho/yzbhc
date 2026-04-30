package com.yunsheng.yzb.utils;

import com.yunsheng.yzb.model.SysDepartment;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 部门树工具类。
 */
public final class DepartmentTreeUtils {

    private DepartmentTreeUtils() {
    }

    /**
     * 将平铺部门列表构建为树。
     */
    public static List<SysDepartment> buildTree(List<SysDepartment> departments) {
        if (departments == null || departments.isEmpty()) {
            return Collections.emptyList();
        }
        Map<Integer, SysDepartment> nodeMap = departments.stream()
                .collect(Collectors.toMap(SysDepartment::getId, Function.identity(), (a, b) -> a));
        List<SysDepartment> roots = new ArrayList<>();
        for (SysDepartment department : departments) {
            department.setChildren(new ArrayList<>());
        }
        for (SysDepartment department : departments) {
            Integer parentId = department.getParentId();
            if (parentId == null || parentId == 0 || !nodeMap.containsKey(parentId)) {
                roots.add(department);
                continue;
            }
            nodeMap.get(parentId).getChildren().add(department);
        }
        return roots;
    }

    /**
     * 展开指定部门及其全部子部门ID。
     */
    public static Set<Long> expandWithDescendants(Collection<Long> deptIds, List<SysDepartment> allDepartments) {
        if (deptIds == null || deptIds.isEmpty()) {
            return Collections.emptySet();
        }
        Map<Integer, List<SysDepartment>> childrenMap = allDepartments.stream()
                .collect(Collectors.groupingBy(dept -> dept.getParentId() == null ? 0 : dept.getParentId()));
        Set<Long> result = new LinkedHashSet<>();
        for (Long deptId : deptIds) {
            if (deptId == null) {
                continue;
            }
            collectDescendants(deptId.intValue(), childrenMap, result);
        }
        return result;
    }

    private static void collectDescendants(Integer deptId, Map<Integer, List<SysDepartment>> childrenMap, Set<Long> collector) {
        collector.add(deptId.longValue());
        for (SysDepartment child : childrenMap.getOrDefault(deptId, Collections.emptyList())) {
            collectDescendants(child.getId(), childrenMap, collector);
        }
    }
}

