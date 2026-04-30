package com.yunsheng.yzb.utils;

import com.yunsheng.yzb.vo.UserPermissionVO;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 权限缓存工具类
 * 用于缓存用户权限信息，提高性能
 */
public class PermissionCacheUtil {

    /**
     * 权限缓存，key为用户ID，value为权限信息
     */
    private static final Map<Integer, CacheEntry> PERMISSION_CACHE = new ConcurrentHashMap<>();

    /**
     * 缓存过期时间（毫秒），默认30分钟
     */
    private static final long CACHE_EXPIRE_TIME = 30 * 60 * 1000;

    /**
     * 缓存条目
     */
    private static class CacheEntry {
        UserPermissionVO permissions;
        long expireTime;

        CacheEntry(UserPermissionVO permissions) {
            this.permissions = permissions;
            this.expireTime = System.currentTimeMillis() + CACHE_EXPIRE_TIME;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expireTime;
        }
    }

    /**
     * 获取用户权限（从缓存）
     */
    public static UserPermissionVO getPermissions(Integer userId) {
        if (userId == null) {
            return null;
        }
        CacheEntry entry = PERMISSION_CACHE.get(userId);
        if (entry != null && !entry.isExpired()) {
            return entry.permissions;
        }
        // 缓存过期，移除
        if (entry != null) {
            PERMISSION_CACHE.remove(userId);
        }
        return null;
    }

    /**
     * 缓存用户权限
     */
    public static void putPermissions(Integer userId, UserPermissionVO permissions) {
        if (userId != null && permissions != null) {
            PERMISSION_CACHE.put(userId, new CacheEntry(permissions));
        }
    }

    /**
     * 清除用户权限缓存
     */
    public static void removePermissions(Integer userId) {
        if (userId != null) {
            PERMISSION_CACHE.remove(userId);
        }
    }

    /**
     * 清除所有权限缓存
     */
    public static void clearAll() {
        PERMISSION_CACHE.clear();
    }

    /**
     * 定期清理过期缓存
     */
    public static void cleanExpiredCache() {
        PERMISSION_CACHE.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}
