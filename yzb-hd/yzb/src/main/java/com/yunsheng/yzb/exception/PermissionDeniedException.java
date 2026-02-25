package com.yunsheng.yzb.exception;

public class PermissionDeniedException extends RuntimeException {

    private int code;
    private String message;
    private Integer userId;
    private String requestUrl;
    private String[] requiredPermissions;
    private String[] requiredRoles;

    public PermissionDeniedException(String message) {
        super(message);
        this.code = 403;
        this.message = message;
    }

    public PermissionDeniedException(String message, Integer userId, String requestUrl, String[] requiredPermissions, String[] requiredRoles) {
        super(message);
        this.code = 403;
        this.message = message;
        this.userId = userId;
        this.requestUrl = requestUrl;
        this.requiredPermissions = requiredPermissions;
        this.requiredRoles = requiredRoles;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public String[] getRequiredPermissions() {
        return requiredPermissions;
    }

    public String[] getRequiredRoles() {
        return requiredRoles;
    }
}
