package com.yunsheng.yzb.model;

import com.lk.api.annotation.LKAModel;
import com.lk.api.annotation.LKAProperty;
import lombok.Data;

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
     * 用户部门
     */
    private String userDep;

    /**
     * 部门id
     */
    private Integer depId;

    private String userToken;

}