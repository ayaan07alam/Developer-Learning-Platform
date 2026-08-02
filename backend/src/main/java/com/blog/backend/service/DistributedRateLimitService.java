package com.blog.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.List;

/** Redis-backed token bucket shared by every application replica. */
@Service
@ConditionalOnBean(StringRedisTemplate.class)
public class DistributedRateLimitService {
    private static final DefaultRedisScript<List> TOKEN_BUCKET = new DefaultRedisScript<>("""
        local current = redis.call('HMGET', KEYS[1], 'tokens', 'updated')
        local tokens = tonumber(current[1]) or tonumber(ARGV[1])
        local updated = tonumber(current[2]) or tonumber(ARGV[3])
        local elapsed = math.max(0, tonumber(ARGV[3]) - updated)
        tokens = math.min(tonumber(ARGV[1]), tokens + (elapsed * tonumber(ARGV[2])))
        if tokens < 1 then
          redis.call('HMSET', KEYS[1], 'tokens', tokens, 'updated', ARGV[3])
          redis.call('PEXPIRE', KEYS[1], ARGV[4])
          return {0, math.ceil((1 - tokens) / tonumber(ARGV[2]))}
        end
        tokens = tokens - 1
        redis.call('HMSET', KEYS[1], 'tokens', tokens, 'updated', ARGV[3])
        redis.call('PEXPIRE', KEYS[1], ARGV[4])
        return {1, 0}
        """, List.class);
    private final StringRedisTemplate redisTemplate;

    public DistributedRateLimitService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Decision consume(String client, String routeClass, int capacity, long periodMs) {
        long now = System.currentTimeMillis();
        // Tokens per millisecond; a scaled unit avoids integer Lua division surprises.
        String key = "rate-limit:" + routeClass + ":" + client;
        List<?> result = redisTemplate.execute(TOKEN_BUCKET, List.of(key), String.valueOf(capacity),
                String.valueOf((double) capacity / periodMs), String.valueOf(now), String.valueOf(periodMs * 2));
        if (result == null || result.size() != 2) throw new IllegalStateException("Redis rate-limit script returned no decision");
        boolean allowed = Long.parseLong(result.get(0).toString()) == 1;
        long retryAfterMs = Long.parseLong(result.get(1).toString());
        return new Decision(allowed, Math.max(1, (long) Math.ceil(retryAfterMs / 1000.0)));
    }

    public record Decision(boolean allowed, long retryAfterSeconds) { }
}
