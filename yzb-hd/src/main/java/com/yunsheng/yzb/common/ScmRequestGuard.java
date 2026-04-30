package com.yunsheng.yzb.common;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * 轻量级请求防重组件，用于拦截短时间内的重复提交。
 */
@Component
public class ScmRequestGuard {

    private static final long PROCESSING_TTL_MILLIS = Duration.ofSeconds(15).toMillis();
    private static final long COMPLETED_TTL_MILLIS = Duration.ofSeconds(5).toMillis();

    private final Map<String, Long> requestLocks = new ConcurrentHashMap<>();

    public <T> T execute(String requestKey, String duplicateMessage, Supplier<T> action) {
        long now = System.currentTimeMillis();
        cleanupExpired(now);
        Long expiresAt = requestLocks.putIfAbsent(requestKey, now + PROCESSING_TTL_MILLIS);
        if (expiresAt != null && expiresAt > now) {
            throw new ScmBusinessException(duplicateMessage);
        }
        try {
            T result = action.get();
            requestLocks.put(requestKey, System.currentTimeMillis() + COMPLETED_TTL_MILLIS);
            return result;
        } catch (RuntimeException ex) {
            requestLocks.remove(requestKey);
            throw ex;
        }
    }

    private void cleanupExpired(long now) {
        Iterator<Map.Entry<String, Long>> iterator = requestLocks.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Long> entry = iterator.next();
            if (entry.getValue() <= now) {
                iterator.remove();
            }
        }
    }
}