package com.blog.backend.repository;

import com.blog.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByDisplayName(String displayName);

    Optional<User> findByOauthProviderAndOauthId(String provider, String oauthId);

    Boolean existsByEmail(String email);

    Boolean existsByDisplayName(String displayName);
}
