package com.yunsheng.yzb.controller;

import com.yunsheng.yzb.mapper.UserTokenMapper;
import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.UserToken;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.YsUserExample;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 登录接口。
 */
@RestController
@RequestMapping("/public")
public class LoginController {
    @Autowired
    private YsUserMapper ysUserMapper;
    @Autowired
    private UserTokenMapper userTokenMapper;


    /**
     * 执行登录并返回用户基础信息。
     *
     * @param userName 登录用户名
     * @param password 登录密码
     * @return 登录结果，成功时包含 token 与用户基础信息
     */
    @GetMapping("/login")
    public AjaxResult<YsUser> login(@RequestParam String userName, @RequestParam String password) {
        YsUserExample ysUserExample = new YsUserExample();
        ysUserExample.createCriteria().andUserNameEqualTo(userName).andPasswordEqualTo(password);
        List<YsUser> ysUserList = ysUserMapper.selectByExample(ysUserExample);
        if (ysUserList.size() < 1) {
            return AjaxResult.res(0, "账号或密码错误", null);
        }

        YsUser ysUser = ysUserList.get(0);
        if (ysUser.getStatus() != null && ysUser.getStatus() == 0) {
            return AjaxResult.res(0, "账号已停用，请联系管理员", null);
        }

        String token = UUID.randomUUID().toString();
        ysUser.setUserToken(token);
        ysUser.setPassword(null);

        UserToken userToken = new UserToken();
        userToken.setUserToken(token);
        userToken.setCdate(new Date());
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthLater = now.plusMonths(1);
        ZonedDateTime zdt = oneMonthLater.atZone(ZoneId.systemDefault());
        Instant instant = zdt.toInstant();
        Date date = Date.from(instant);
        userToken.setExpiratedtime(date);
        userToken.setUserId(ysUser.getId());
        userTokenMapper.insert(userToken);
        return AjaxResult.res(1, "登录成功", ysUser);
    }
}

