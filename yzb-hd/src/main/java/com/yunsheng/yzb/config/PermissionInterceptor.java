package com.yunsheng.yzb.config;

import com.yunsheng.yzb.config.annotation.RequiresPermission;
import com.yunsheng.yzb.config.annotation.RequiresRole;
import com.yunsheng.yzb.exception.PermissionDeniedException;
import com.yunsheng.yzb.exception.UnauthorizedException;
import com.yunsheng.yzb.model.YsUser;
import com.yunsheng.yzb.service.PermissionService;
import com.yunsheng.yzb.service.RoleService;
import com.yunsheng.yzb.utils.LoginCacheUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 权限拦截器
 */
@Component
public class PermissionInterceptor implements HandlerInterceptor {

    @Resource
    private PermissionService permissionService;

    @Resource
    private RoleService roleService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        String requestUrl = request.getRequestURI();
        
        // 获取当前登录用户ID
        YsUser currentAccount = LoginCacheUtil.getCurrentAccount();
        Integer userId = LoginCacheUtil.getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("未登录或登录已过期");
        }

        // 检查方法级别的权限注解
        RequiresPermission methodPermission = handlerMethod.getMethodAnnotation(RequiresPermission.class);
        if (methodPermission != null && !checkPermission(userId, methodPermission)) {
            throw new PermissionDeniedException("权限不足", userId, requestUrl, methodPermission.value(), null);
        }

        // 检查类级别的权限注解
        RequiresPermission classPermission = handlerMethod.getBeanType().getAnnotation(RequiresPermission.class);
        if (classPermission != null && !checkPermission(userId, classPermission)) {
            throw new PermissionDeniedException("权限不足", userId, requestUrl, classPermission.value(), null);
        }

        // 检查方法级别的角色注解
        RequiresRole methodRole = handlerMethod.getMethodAnnotation(RequiresRole.class);
        if (methodRole != null && !checkRole(userId, methodRole)) {
            throw new PermissionDeniedException("角色权限不足", userId, requestUrl, null, methodRole.value());
        }

        // 检查类级别的角色注解
        RequiresRole classRole = handlerMethod.getBeanType().getAnnotation(RequiresRole.class);
        if (classRole != null && !checkRole(userId, classRole)) {
            throw new PermissionDeniedException("角色权限不足", userId, requestUrl, null, classRole.value());
        }

        return true;
    }

    /**
     * 检查权限
     */
    private boolean checkPermission(Integer userId, RequiresPermission annotation) {
        String[] permissions = annotation.value();
        if (permissions.length == 0) {
            return true;
        }

        if (annotation.logical() == RequiresPermission.Logical.AND) {
            return permissionService.hasAllPermissions(userId, permissions);
        } else {
            return permissionService.hasAnyPermission(userId, permissions);
        }
    }

    /**
     * 检查角色
     */
    private boolean checkRole(Integer userId, RequiresRole annotation) {
        String[] roles = annotation.value();
        if (roles.length == 0) {
            return true;
        }

        if (annotation.logical() == RequiresRole.Logical.AND) {
            for (String role : roles) {
                if (!roleService.hasRole(userId, role)) {
                    return false;
                }
            }
            return true;
        } else {
            return roleService.hasAnyRole(userId, roles);
        }
    }
}
