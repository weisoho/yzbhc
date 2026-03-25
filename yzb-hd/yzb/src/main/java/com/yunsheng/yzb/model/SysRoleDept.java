package com.yunsheng.yzb.model;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 角色部门数据权限关联实体。
 */
@Data
public class SysRoleDept implements Serializable {
    private static final long serialVersionUID = 1L;

    /** 主键ID。 */
    private Long id;
    /** 角色ID。 */
    private Long roleId;
    /** 部门ID。 */
    private Long deptId;
    /** 创建时间。 */
    private Date createTime;
}

