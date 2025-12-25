package com.blog.backend.controller;

import com.blog.backend.dto.*;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import com.blog.backend.repository.UserRepository;
import com.blog.backend.security.JwtUtil;
import com.blog.backend.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email already registered");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username already taken");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.VIEWER); // Default role for new users
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());

        // Create response
        UserDTO userDTO = new UserDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                savedUser.getRole().name(),
                savedUser.getOauthProvider(),
                savedUser.getCreatedAt(),
                savedUser.getBio(),
                savedUser.getProfilePhoto());

        return ResponseEntity.ok(new AuthResponse(token, userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = userOpt.get();

        // Check if account is active
        if (!user.getActive()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Account is disabled");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Generate new token
        String newToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        // Create response
        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                user.getOauthProvider(),
                user.getCreatedAt(),
                user.getBio(),
                user.getProfilePhoto());

        return ResponseEntity.ok(new AuthResponse(newToken, userDTO));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                user.getOauthProvider(),
                user.getCreatedAt(),
                user.getBio(),
                user.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/username")
    public ResponseEntity<?> updateUsername(@RequestBody Map<String, String> request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String newUsername = request.get("username");
        if (newUsername == null || newUsername.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (newUsername.length() < 3 || newUsername.length() > 30) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username must be between 3 and 30 characters");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if username is already taken
        if (userRepository.existsByUsername(newUsername)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Username already taken");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        User user = (User) authentication.getPrincipal();
        // Update username
        user.setUsername(newUsername);
        User updatedUser = userRepository.save(user);

        UserDTO userDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getUsername(),
                updatedUser.getRole().name(),
                updatedUser.getOauthProvider(),
                updatedUser.getCreatedAt(),
                updatedUser.getBio(),
                updatedUser.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        String credential = request.get("credential");

        if (credential == null || credential.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Google credential is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Verify Google token
        GoogleIdToken.Payload payload = googleAuthService.verifyToken(credential);

        if (payload == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid Google token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Check if email is verified
        if (!googleAuthService.isEmailVerified(payload)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email not verified by Google");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        String email = googleAuthService.getEmail(payload);
        String name = googleAuthService.getName(payload);
        String picture = googleAuthService.getPicture(payload);

        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            // User exists, update OAuth provider if needed
            user = existingUser.get();
            if (user.getOauthProvider() == null || !user.getOauthProvider().equals("GOOGLE")) {
                user.setOauthProvider("GOOGLE");
                user = userRepository.save(user);
            }
        } else {
            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : email.split("@")[0]);
            newUser.setPassword(""); // No password for OAuth users
            newUser.setOauthProvider("GOOGLE");
            newUser.setOauthId(payload.getSubject());
            newUser.setRole(Role.VIEWER);
            newUser.setProfilePhoto(picture); // Set Google profile picture
            user = userRepository.save(newUser);
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                user.getOauthProvider(),
                user.getCreatedAt(),
                user.getBio(),
                user.getProfilePhoto());

        response.put("user", userDTO);

        return ResponseEntity.ok(response);
    }
}
