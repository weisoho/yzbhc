package com.yunsheng.yzb.common;

/**
 * 供应链模块业务异常。
 */
public class ScmBusinessException extends RuntimeException {

    public ScmBusinessException(String message) {
        super(message);
    }
}