package com.yunsheng.yzb.controller;

import com.lk.api.annotation.LKAMethod;
import com.lk.api.annotation.LKAParam;
import com.lk.api.annotation.LKARespose;
import com.lk.api.annotation.LKAType;
import com.yunsheng.yzb.mapper.UserTokenMapper;
import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.UserToken;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.model.YsUserExample;
import com.yunsheng.yzb.utils.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/public")
public class LoginController {
    @Autowired
    private YsUserMapper ysUserMapper;
    private UserTokenMapper userTokenMapper;



    @GetMapping("/login")
    public AjaxResult login(String userName ,String password){
        YsUserExample ysUserExample = new YsUserExample();
        ysUserExample.createCriteria().andUserNameEqualTo(userName).andPasswordEqualTo(password);
        List<YsUser> ysUserList = ysUserMapper.selectByExample(ysUserExample);
        if(ysUserList.size()<1){
            return AjaxResult.res(0,"账号或密码错误",null);
        }
        //生成token
        String token=UUID.randomUUID().toString();
        YsUser ysUser = ysUserList.get(0);
        ysUser.setUserToken(token);
        //新增userToken数据 开始==============
        UserToken userToken = new UserToken();
        userToken.setUserToken(token);
        userToken.setCdate(new Date());
        LocalDateTime now = LocalDateTime.now();

        // 获取一个月后的日期时间（时间保持不变）
        LocalDateTime oneMonthLater = now.plusMonths(1);
        ZonedDateTime zdt = oneMonthLater.atZone(ZoneId.systemDefault());
        Instant instant = zdt.toInstant();
        Date date = Date.from(instant);
        userToken.setExpiratedtime(date);
        userToken.setUserId(ysUser.getId());
        userTokenMapper.insert(userToken);
        //新增userToken数据 结束==================
        return AjaxResult.res(1,"登录成功",ysUser);
    }
}
