package com.yunsheng.yzb.model;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 部门实体类
 */
@Data
public class SysDepartment implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 部门ID
     */
    private Integer id;

    /**
     * 父部门ID
     */
    private Integer parentId;

    /**
     * 部门名称
     */
    private String deptName;

    /**
     * 部门编码
     */
    private String deptCode;

    /**
     * 负责人
     */
    private String leader;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

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
     * 子部门列表（用于树形结构）
     */
    private List<SysDepartment> children;
}
