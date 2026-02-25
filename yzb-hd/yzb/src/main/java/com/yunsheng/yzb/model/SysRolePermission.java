package com.yunsheng.yzb.model;

import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 角色权限关联实体类
 */
@Data
public class SysRolePermission implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 角色ID
     */
    private Long roleId;

    /**
     * 权限ID
     */
    private Long permissionId;

    /**
     * 创建人
     */
    private Integer createBy;

    /**
     * 创建时间
     */
    private Date createTime;
}
