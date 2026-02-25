package com.yunsheng.yzb.model;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 权限实体类
 */
@Data
public class SysPermission implements Serializable {
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
    private String permissionName;

    /**
     * 权限编码
     */
    private String permissionCode;

    /**
     * 权限类型：1-菜单 2-按钮 3-接口
     */
    private Integer permissionType;

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
     * HTTP方法
     */
    private String method;

    /**
     * API路径匹配模式
     */
    private String apiPattern;

    /**
     * 状态：0-禁用 1-启用
     */
    private Integer status;

    /**
     * 排序
     */
    private Integer sortOrder;

    /**
     * 创建人
     */
    private Integer createBy;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新人
     */
    private Integer updateBy;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 删除标记：0-未删除 1-已删除
     */
    private Integer isDeleted;

    /**
     * 子权限列表（用于树形结构）
     */
    private List<SysPermission> children;
}
