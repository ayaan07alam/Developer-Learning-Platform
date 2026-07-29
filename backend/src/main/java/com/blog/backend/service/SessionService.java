package com.blog.backend.service;

import com.blog.backend.model.User;
import com.blog.backend.model.UserSession;
import com.blog.backend.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class SessionService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final UserSessionRepository sessionRepository;
    private final long refreshTokenLifetimeMs;

    public SessionService(UserSessionRepository sessionRepository,
            @Value("${jwt.refresh-expiration}") long refreshTokenLifetimeMs) {
        this.sessionRepository = sessionRepository;
        this.refreshTokenLifetimeMs = refreshTokenLifetimeMs;
    }

    public String create(User user) {
        return persist(user);
    }

    /** A refresh token can be used once. Reuse revokes the compromised session. */
    public Optional<RotatedSession> rotate(String presentedToken) {
        String hash = hash(presentedToken);
        Optional<UserSession> existing = sessionRepository.findByTokenHash(hash);
        if (existing.isEmpty()) return Optional.empty();

        UserSession session = existing.get();
        if (session.getRevokedAt() != null || session.getExpiresAt().isBefore(LocalDateTime.now())
                || !Boolean.TRUE.equals(session.getUser().getActive())) {
            session.setRevokedAt(LocalDateTime.now());
            sessionRepository.save(session);
            return Optional.empty();
        }

        session.setRevokedAt(LocalDateTime.now());
        session.setRotatedAt(LocalDateTime.now());
        sessionRepository.save(session);
        return Optional.of(new RotatedSession(session.getUser(), persist(session.getUser())));
    }

    public void revoke(String presentedToken) {
        sessionRepository.findByTokenHash(hash(presentedToken)).ifPresent(session -> {
            if (session.getRevokedAt() == null) {
                session.setRevokedAt(LocalDateTime.now());
                sessionRepository.save(session);
            }
        });
    }

    private String persist(User user) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        UserSession session = new UserSession();
        session.setUser(user);
        session.setTokenHash(hash(token));
        session.setExpiresAt(LocalDateTime.now().plusNanos(refreshTokenLifetimeMs * 1_000_000));
        sessionRepository.save(session);
        return token;
    }

    private String hash(String value) {
        try {
            return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    public record RotatedSession(User user, String refreshToken) { }
}
