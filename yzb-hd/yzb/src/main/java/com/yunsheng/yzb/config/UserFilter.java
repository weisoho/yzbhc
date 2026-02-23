
package com.yunsheng.yzb.config;

import com.yunsheng.yzb.mapper.UserTokenMapper;
import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.UserToken;
import com.yunsheng.yzb.model.UserTokenExample;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;
import java.util.List;



@Order(1)
@WebFilter(filterName = "appFilter", urlPatterns = "/yzb/*")
public class UserFilter implements Filter {
    @Autowired
    private YsUserMapper  ysUserMapper;

    @Autowired
    private UserTokenMapper userTokenMapper;


    public void init(FilterConfig filterConfig)  {
    }

    @Override
    public void doFilter( ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        //登陆获取token
        String token = req.getHeader("token");
        UserTokenExample tokenExample = new UserTokenExample();
        tokenExample.createCriteria().andUserTokenEqualTo(token).andExpiratedtimeGreaterThan(new Date());
        List<UserToken> userTokens = userTokenMapper.selectByExample(tokenExample);
        if(userTokens.size()<1){
            return;
        }
        //查询token是否过期，user_token表
        YsUser user = ysUserMapper.selectByPrimaryKey(userTokens.get(0).getId());
        //设置缓存
        LoginCacheUtil.setCurrentAccount(user);
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }

}




