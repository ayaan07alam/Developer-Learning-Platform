package com.blog.backend.config;

import com.blog.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/categories",
                                                                "/api/categories/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts/*/likes/count").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts/*/likes/me").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts/*/comments").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts/*/comments/count",
                                                                "/api/likes/**",
                                                                "/api/comments/post/**")
                                                .permitAll()
                                                .requestMatchers("/h2-console/**").permitAll()

                                                // Job platform public endpoints (categories and types)
                                                .requestMatchers(HttpMethod.GET, "/api/jobs/categories",
                                                                "/api/jobs/types")
                                                .permitAll()

                                                // Job platform endpoints - require authentication
                                                .requestMatchers("/api/users/job-role", "/api/users/select-job-role",
                                                                "/api/users/change-job-role")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/jobs", "/api/jobs/*/apply")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").authenticated()
                                                .requestMatchers("/api/jobs/my-jobs", "/api/jobs/my-applications",
                                                                "/api/jobs/*/applications", "/api/jobs/*/close")
                                                .authenticated()

                                                // Review workflow endpoints
                                                .requestMatchers("/api/reviews/**").authenticated()

                                                // Like and Comment permissions for authenticated users (BEFORE post
                                                // management)
                                                .requestMatchers(HttpMethod.POST, "/api/posts/*/likes").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/posts/*/likes")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/posts/*/comments")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PUT, "/api/comments/**").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated()

                                                // Protected endpoints - require authentication
                                                .requestMatchers("/api/dashboard/**").hasAnyAuthority("ADMIN", "EDITOR")

                                                // Post creation - all authenticated users can create posts
                                                .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()

                                                // Post management - permissions checked in controller
                                                .requestMatchers(HttpMethod.PUT, "/api/posts/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.PATCH, "/api/posts/**")
                                                .authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/posts/**")
                                                .authenticated()

                                                .requestMatchers("/api/categories/**")
                                                .hasAnyAuthority("ADMIN", "EDITOR")
                                                .requestMatchers("/api/authors/**").hasAnyAuthority("ADMIN", "EDITOR")
                                                .requestMatchers("/api/users/*/role").hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/users/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Admin
                                                                                                        // endpoints
                                                .requestMatchers("/api/profile/**").authenticated() // Profile
                                                                                                    // management for
                                                                                                    // all authenticated
                                                                                                    // users
                                                .requestMatchers("/api/comments/admin/**").hasAuthority("ADMIN")
                                                .anyRequest().permitAll())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                // For H2 console
                http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
