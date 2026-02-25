package com.yunsheng.yzb.exception;

public class UnauthorizedException extends RuntimeException {

    private int code;
    private String message;

    public UnauthorizedException(String message) {
        super(message);
        this.code = 401;
        this.message = message;
    }

    public UnauthorizedException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
