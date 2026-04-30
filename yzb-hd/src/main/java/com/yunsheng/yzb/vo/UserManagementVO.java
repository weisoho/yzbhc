package com.yunsheng.yzb.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 系统管理页面使用的用户视图对象。
 */
@Data
public class UserManagementVO {

    private Integer id;

    private String userName;

    private String realName;

    private String userDep;

    private Integer depId;

    private String phone;

    private String email;

    private String accountType;

    private String warehouseScope;

    private Integer status;

    private Date createTime;

    private Date updateTime;

    private List<Long> roleIds;

    private List<String> roleNames;
}