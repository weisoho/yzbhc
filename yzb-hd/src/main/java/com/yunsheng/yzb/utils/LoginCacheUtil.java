package com.yunsheng.yzb.utils;

import com.yunsheng.yzb.model.YsUser;

public class LoginCacheUtil {

    private static ThreadLocal<YsUser> loginCache = new ThreadLocal<>();

    public static YsUser getCurrentAccount() {
        return loginCache.get();
    }

    public static void setCurrentAccount(YsUser currentAccount) {
        loginCache.set(currentAccount);
    }

    public static void remove(){
        loginCache.remove();
    }

    public static Integer getCurrentUserId(){
        return getCurrentAccount().getId();
    }

}

