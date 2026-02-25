package com.yunsheng.yzb.config;

import com.yunsheng.yzb.mapper.UserTokenMapper;
import com.yunsheng.yzb.mapper.YsUserMapper;
import com.yunsheng.yzb.model.UserToken;
import com.yunsheng.yzb.model.UserTokenExample;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;

import javax.annotation.Resource;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Order(1)
@WebFilter(filterName = "appFilter")
public class UserFilter implements Filter {
    @Resource
    private YsUserMapper ysUserMapper;

    @Resource
    private UserTokenMapper userTokenMapper;

    // 定义需要排除的接口（登录相关）
    private Set<String> excludePaths;

    // 初始化排除的接口集合
    @Override
    public void init(FilterConfig filterConfig) {
        excludePaths = Arrays.asList(
                "/public/login"         // 登录接口
        ).stream().collect(Collectors.toSet());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        // 获取当前请求的路径
        String requestURI = req.getRequestURI();

        // 1. 判断是否是排除的接口（登录相关），如果是直接放行
        if (excludePaths.contains(requestURI)) {
            chain.doFilter(request, response);
            return; // 放行后直接返回，不执行后续校验逻辑
        }

        // 2. 非排除接口，执行token校验逻辑
        String token = req.getHeader("token");
        // token为空时直接拦截
        if (token == null || token.trim().isEmpty()) {
            // 返回错误信息
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"token不能为空\"}");
            return;
        }
        UserTokenExample tokenExample = new UserTokenExample();
        tokenExample.createCriteria().andUserTokenEqualTo(token).andExpiratedtimeGreaterThan(new Date());
        List<UserToken> userTokens = userTokenMapper.selectByExample(tokenExample);
        // token不存在或已过期，拦截请求
        if (userTokens.isEmpty()) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"token无效或已过期\"}");
            return;
        }
        // 查询用户信息并设置缓存
        YsUser user = ysUserMapper.selectByPrimaryKey(userTokens.get(0).getUserId());
        if(user == null){
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"未查询到登录用户\"}");
        }
        LoginCacheUtil.setCurrentAccount(user);

        // 校验通过，放行请求
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}