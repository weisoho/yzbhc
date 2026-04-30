package com.yunsheng.yzb.utils;

import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.vo.UserPermissionVO;
import java.util.Set;

/**
 * 数据权限工具类
 * 用于构建数据权限SQL条件
 */
public class DataScopeUtil {

    /**
     * 构建数据权限SQL条件
     * @param tableAlias 表别名
     * @param deptColumn 部门字段名
     * @param userColumn 用户字段名
     * @return SQL条件字符串
     */
    public static String buildDataScopeCondition(String tableAlias, String deptColumn, String userColumn) {
        Integer userId = LoginCacheUtil.getCurrentUserId();
        if (userId == null) {
            return " AND 1=0"; // 未登录，无权限
        }

        UserPermissionVO permissions = PermissionCacheUtil.getPermissions(userId);
        if (permissions == null) {
            return " AND 1=0"; // 无权限信息
        }

        Integer dataScope = permissions.getDataScope();
        if (dataScope == null) {
            dataScope = 4; // 默认仅本人
        }

        StringBuilder condition = new StringBuilder();
        String prefix = tableAlias != null && !tableAlias.isEmpty() ? tableAlias + "." : "";
        Long currentDeptId = getCurrentUserDeptId();

        switch (dataScope) {
            case 1: // 全部数据权限
                // 不添加任何条件
                break;
            case 2: // 本部门及以下数据权限
                if (currentDeptId == null) {
                    condition.append(" AND 1=0");
                } else {
                    condition.append(" AND ").append(prefix).append(deptColumn)
                            .append(" IN (SELECT id FROM sys_department WHERE is_deleted = 0 AND (id = ")
                            .append(currentDeptId)
                            .append(" OR parent_id = ")
                            .append(currentDeptId)
                            .append("))");
                }
                break;
            case 3: // 本部门数据权限
                if (currentDeptId == null) {
                    condition.append(" AND 1=0");
                } else {
                    condition.append(" AND ").append(prefix).append(deptColumn)
                            .append(" = ").append(currentDeptId);
                }
                break;
            case 4: // 仅本人数据权限
                condition.append(" AND ").append(prefix).append(userColumn)
                        .append(" = ").append(userId);
                break;
            case 5: // 自定义数据权限
                Set<Integer> customDeptIds = permissions.getCustomDeptIds();
                if (customDeptIds != null && !customDeptIds.isEmpty()) {
                    condition.append(" AND ").append(prefix).append(deptColumn)
                            .append(" IN (");
                    int i = 0;
                    for (Integer deptId : customDeptIds) {
                        if (i++ > 0) {
                            condition.append(",");
                        }
                        condition.append(deptId);
                    }
                    condition.append(")");
                } else {
                    condition.append(" AND 1=0"); // 无自定义部门，无权限
                }
                break;
            default:
                condition.append(" AND 1=0"); // 未知权限范围，无权限
        }

        return condition.toString();
    }

    /**
     * 获取当前用户部门ID
     */
    private static Long getCurrentUserDeptId() {
        YsUser currentAccount = LoginCacheUtil.getCurrentAccount();
        if (currentAccount == null || currentAccount.getDepId() == null) {
            return null;
        }
        return currentAccount.getDepId().longValue();
    }

    /**
     * 检查是否有数据权限
     */
    public static boolean hasDataPermission(Long targetUserId, Long targetDeptId) {
        Integer currentUserId = LoginCacheUtil.getCurrentUserId();
        if (currentUserId == null) {
            return false;
        }

        UserPermissionVO permissions = PermissionCacheUtil.getPermissions(currentUserId);
        if (permissions == null) {
            return false;
        }

        Integer dataScope = permissions.getDataScope();
        if (dataScope == null) {
            dataScope = 4;
        }

        Long currentDeptId = getCurrentUserDeptId();

        switch (dataScope) {
            case 1: // 全部数据权限
                return true;
            case 2: // 本部门及以下
                return targetDeptId != null && currentDeptId != null
                        && targetDeptId.longValue() == currentDeptId.longValue();
            case 3: // 本部门
                return targetDeptId != null && currentDeptId != null
                        && targetDeptId.longValue() == currentDeptId.longValue();
            case 4: // 仅本人
                return targetUserId != null && currentUserId.intValue() == targetUserId.intValue();
            case 5: // 自定义
                Set<Integer> customDeptIds = permissions.getCustomDeptIds();
                return targetDeptId != null && customDeptIds != null && customDeptIds.contains(targetDeptId.intValue());
            default:
                return false;
        }
    }
}
