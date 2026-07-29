package com.blog.backend.security;

import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {
    private static final String SECRET = "a-32-byte-minimum-test-secret-value!";

    @Test
    void generatesAndValidatesShortLivedTokens() {
        JwtUtil jwtUtil = configuredJwtUtil(900_000L);
        String token = jwtUtil.generateToken("user@example.com", 42L, "VIEWER");

        assertTrue(jwtUtil.validateToken(token));
        assertEquals("user@example.com", jwtUtil.getEmailFromToken(token));
        assertEquals(42L, jwtUtil.getUserIdFromToken(token));
        assertEquals("VIEWER", jwtUtil.getRoleFromToken(token));
        assertFalse(jwtUtil.validateToken(token + "tampered"));
    }

    @Test
    void rejectsUnsafeConfiguration() {
        JwtUtil jwtUtil = configuredJwtUtil(900_001L);
        assertThrows(IllegalStateException.class, jwtUtil::validateConfiguration);
    }

    private JwtUtil configuredJwtUtil(long expiration) {
        JwtUtil jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expiration", expiration);
        return jwtUtil;
    }
}
