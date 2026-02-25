package com.yunsheng.yzb.vo;

import lombok.Data;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * 用户权限信息VO
 */
@Data
public class UserPermissionVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 角色编码列表
     */
    private Set<String> roleCodes;

    /**
     * 权限编码列表
     */
    private Set<String> permissionCodes;

    /**
     * 菜单树
     */
    private List<PermissionTreeVO> menuTree;

    /**
     * 按钮权限列表
     */
    private Set<String> buttonPermissions;

    /**
     * 数据权限范围
     */
    private Integer dataScope;

    /**
     * 自定义数据权限部门ID列表
     */
    private Set<Integer> customDeptIds;
}
