package com.yunsheng.yzb.model;

import java.util.Date;

public class UserToken {
    /**
     * id
     */
    private Integer id;

    /**
     * token
     */
    private String userToken;

    /**
     * 登录时间
     */
    private Date cdate;

    /**
     * 过期时间
     */
    private Date expiratedtime;

    /**
     * 用户id
     */
    private Integer userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken == null ? null : userToken.trim();
    }

    public Date getCdate() {
        return cdate;
    }

    public void setCdate(Date cdate) {
        this.cdate = cdate;
    }

    public Date getExpiratedtime() {
        return expiratedtime;
    }

    public void setExpiratedtime(Date expiratedtime) {
        this.expiratedtime = expiratedtime;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}