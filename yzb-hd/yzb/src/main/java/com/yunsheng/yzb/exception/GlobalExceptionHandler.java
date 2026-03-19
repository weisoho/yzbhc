package com.yunsheng.yzb.exception;

import com.yunsheng.yzb.utils.AjaxResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UnauthorizedException.class)
    public AjaxResult<Void> handleUnauthorizedException(UnauthorizedException e, HttpServletResponse response) {
        logger.error("未授权访问: {}", e.getMessage());
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return AjaxResult.res(e.getCode(), e.getMessage(), null);
    }

    @ExceptionHandler(PermissionDeniedException.class)
    public AjaxResult<Void> handlePermissionDeniedException(PermissionDeniedException e, HttpServletResponse response) {
        StringBuilder sb = new StringBuilder();
        sb.append("权限不足 - 用户ID: ").append(e.getUserId());
        sb.append(", 请求URL: ").append(e.getRequestUrl());
        
        if (e.getRequiredPermissions() != null && e.getRequiredPermissions().length > 0) {
            sb.append(", 所需权限: ").append(Arrays.toString(e.getRequiredPermissions()));
        }
        
        if (e.getRequiredRoles() != null && e.getRequiredRoles().length > 0) {
            sb.append(", 所需角色: ").append(Arrays.toString(e.getRequiredRoles()));
        }
        
        sb.append(", 错误信息: ").append(e.getMessage());
        
        logger.error(sb.toString());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return AjaxResult.res(e.getCode(), e.getMessage(), null);
    }

    @ExceptionHandler(RuntimeException.class)
    public AjaxResult<Void> handleRuntimeException(RuntimeException e, HttpServletResponse response) {
        logger.error("运行时异常", e);
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return AjaxResult.res(400, e.getMessage(), null);
    }

    @ExceptionHandler(ScmBusinessException.class)
    public AjaxResult<Void> handleScmBusinessException(ScmBusinessException e, HttpServletResponse response) {
        logger.warn("供应链业务异常: {}", e.getMessage());
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return AjaxResult.res(400, e.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public AjaxResult<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
                                                                  HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("请求参数不合法");
        return AjaxResult.res(400, message, null);
    }

    @ExceptionHandler(BindException.class)
    public AjaxResult<Void> handleBindException(BindException e, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("请求参数不合法");
        return AjaxResult.res(400, message, null);
    }

    @ExceptionHandler(Exception.class)
    public AjaxResult<Void> handleException(Exception e, HttpServletResponse response) {
        logger.error("系统异常", e);
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        return AjaxResult.res(500, "系统异常，请联系管理员", null);
    }
}

