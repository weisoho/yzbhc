package com.yunsheng.yzb.model;

import lombok.Data;

import java.util.Date;

@Data
public class YsUser {
    /**
     * id
     */
    private Integer id;

    /**
        * 用户名
     */
    private String userName;

    /**
        * 密码
     */
    private String password;

    /**
        * 姓名
     */
    private String realName;

    /**
        * 用户部门
     */
    private String userDep;

    /**
        * 部门 id
     */
    private Integer depId;

    /**
        * 联系电话
     */
    private String phone;

    /**
        * 邮箱
     */
    private String email;

    /**
        * 账号属性
     */
    private String accountType;

    /**
        * 仓库权限范围
     */
    private String warehouseScope;

    /**
        * 状态：1-启用，0-禁用
     */
    private Integer status;

    /**
        * 创建时间
     */
    private Date createTime;

    /**
        * 更新时间
     */
    private Date updateTime;

    private String userToken;

}
