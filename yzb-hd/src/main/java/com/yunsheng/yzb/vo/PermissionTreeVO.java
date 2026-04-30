package com.yunsheng.yzb.vo;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * 权限树VO
 */
@Data
public class PermissionTreeVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 权限ID
     */
    private Long id;

    /**
     * 父权限ID
     */
    private Long parentId;

    /**
     * 权限名称
     */
    private String name;

    /**
     * 权限编码
     */
    private String code;

    /**
     * 权限类型
     */
    private Integer type;

    /**
     * 路由路径
     */
    private String path;

    /**
     * 组件路径
     */
    private String component;

    /**
     * 图标
     */
    private String icon;

    /**
     * 排序
     */
    private Integer sortOrder;

    /**
     * 子权限列表
     */
    private List<PermissionTreeVO> children;
}
