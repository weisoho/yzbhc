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
    private static final List<String> EXCLUDE_PATH_PREFIXES = Arrays.asList(
            "/api/files/"
    );

    @Resource
    private YsUserMapper ysUserMapper;

    @Resource
    private UserTokenMapper userTokenMapper;

    // 定义无需鉴权的接口。
    private Set<String> excludePaths;

    // 初始化排除路径集合。
    @Override
    public void init(FilterConfig filterConfig) {
        excludePaths = Arrays.asList(
                "/public/login",
                "/yzb/selectRepairList",
                "/yzb/addRepair",
            "/yzb/updateRepair",
            "/api/upload"
        ).stream().collect(Collectors.toSet());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String requestURI = req.getRequestURI();
        String method = req.getMethod();

        // 处理OPTIONS请求，直接通过
        if ("OPTIONS".equals(method)) {
            chain.doFilter(request, response);
            return;
        }

        if (excludePaths.contains(requestURI) || EXCLUDE_PATH_PREFIXES.stream().anyMatch(requestURI::startsWith)) {
            chain.doFilter(request, response);
            return;
        }

        String token = req.getHeader("token");
        if (token == null || token.trim().isEmpty()) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"token不能为空\"}");
            return;
        }
        UserTokenExample tokenExample = new UserTokenExample();
        tokenExample.createCriteria().andUserTokenEqualTo(token).andExpiratedtimeGreaterThan(new Date());
        List<UserToken> userTokens = userTokenMapper.selectByExample(tokenExample);
        if (userTokens.isEmpty()) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"token无效或已过期\"}");
            return;
        }
        YsUser user = ysUserMapper.selectByPrimaryKey(userTokens.get(0).getUserId());
        if (user == null) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"未查询到登录用户\"}");
            return;
        }
        if (user.getStatus() != null && user.getStatus() == 0) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"当前账号已停用\"}");
            return;
        }
        LoginCacheUtil.setCurrentAccount(user);

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
