package com.blog.backend;

import com.blog.backend.model.*;
import com.blog.backend.repository.AuthorRepository;
import com.blog.backend.repository.CategoryRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

        private final PostRepository postRepository;
        private final AuthorRepository authorRepository;
        private final CategoryRepository categoryRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(PostRepository postRepository, AuthorRepository authorRepository,
                        CategoryRepository categoryRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                this.postRepository = postRepository;
                this.authorRepository = authorRepository;
                this.categoryRepository = categoryRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) throws Exception {
                // Create admin user if not exists
                User admin;
                if (userRepository.count() == 0) {
                        admin = new User();
                        admin.setEmail("ayaanalam78670@gmail.com");
                        admin.setUsername("Ayaan Alam");
                        admin.setPassword(passwordEncoder.encode("Admin@123")); // Change this password after first
                                                                                // login!
                        admin.setRole(Role.ADMIN);
                        admin.setIsActive(true);
                        userRepository.save(admin);
                        System.out.println("=".repeat(60));
                        System.out.println("ADMIN USER CREATED!");
                        System.out.println("Email: ayaanalam78670@gmail.com");
                        System.out.println("Password: Admin@123");
                        System.out.println("PLEASE CHANGE THIS PASSWORD AFTER FIRST LOGIN!");
                        System.out.println("=".repeat(60));
                } else {
                        // Get existing admin user
                        admin = userRepository.findByEmail("ayaanalam78670@gmail.com")
                                        .orElseGet(() -> userRepository.findAll().get(0));
                }

                if (postRepository.count() == 0) {
                        Author author = new Author();
                        author.setName("Ayaan");
                        author.setSlug("alam-ayaan");
                        author.setImage("https://avatars.githubusercontent.com/u/1?v=4");
                        author.setBio(
                                        "[{\"_type\":\"block\",\"children\":[{\"_type\":\"span\",\"text\":\"A passionate full-stack developer and tech enthusiast.\",\"marks\":[]}]}]");
                        authorRepository.save(author);

                        Category catReact = new Category(null, "React", "Frontend Framework");
                        Category catNextJS = new Category(null, "Next.js", "React Framework");
                        Category catTypeScript = new Category(null, "TypeScript", "Programming Language");
                        categoryRepository.save(catReact);
                        categoryRepository.save(catNextJS);
                        categoryRepository.save(catTypeScript);

                        // Post 1: Mastering React Hooks
                        Post post1 = new Post();
                        post1.setTitle("Mastering React Hooks");
                        post1.setSlug("mastering-react-hooks");
                        post1.setMainImage(
                                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80");
                        post1.setExcerpt("A deep dive into useState, useEffect, and custom hooks.");
                        post1.setStatus(PostStatus.PUBLISHED);
                        post1.setContent(
                                        "<h2>Introduction to React Hooks</h2><p>React Hooks revolutionized the way we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and learn how to create custom hooks for reusable logic.</p><h3>useState Hook</h3><p>The useState hook allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.</p><h3>useEffect Hook</h3><p>The useEffect hook lets you perform side effects in functional components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p><h3>Custom Hooks</h3><p>Custom hooks allow you to extract component logic into reusable functions. They're a powerful way to share stateful logic between components without changing your component hierarchy.</p>");
                        post1.setAuthor(author);
                        post1.setCreatedBy(admin); // Set the user who created it
                        Set<Category> cats1 = new HashSet<>();
                        cats1.add(catReact);
                        post1.setCategories(cats1);
                        post1.setPublishedAt(LocalDateTime.now().minusDays(5));
                        postRepository.save(post1);

                        // Post 2: Next.js 14 App Router
                        Post post2 = new Post();
                        post2.setTitle("Next.js 14 App Router");
                        post2.setSlug("nextjs-14-app-router");
                        post2.setMainImage(
                                        "https://images.unsplash.com/photo-1618477247222-ac5913054e0e?auto=format&fit=crop&w=800&q=80");
                        post2.setExcerpt(
                                        "Everything you need to know about the new App Router in Next.js 14.");
                        post2.setStatus(PostStatus.PUBLISHED);
                        post2.setContent(
                                        "<h2>The New App Router</h2><p>Next.js 14 introduces a revolutionary new way to build applications with the App Router. This new routing system is built on top of React Server Components and provides a more intuitive and powerful way to structure your applications.</p><h3>Server Components</h3><p>Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client and improving performance.</p><h3>Layouts and Templates</h3><p>The App Router introduces new concepts like layouts and templates that make it easier to share UI between routes while preserving state and avoiding unnecessary re-renders.</p><h3>Data Fetching</h3><p>Learn about the new data fetching patterns in Next.js 14, including streaming, parallel data fetching, and automatic request deduplication.</p>");
                        post2.setAuthor(author);
                        post2.setCreatedBy(admin); // Set the user who created it
                        Set<Category> cats2 = new HashSet<>();
                        cats2.add(catNextJS);
                        cats2.add(catReact);
                        post2.setCategories(cats2);
                        post2.setPublishedAt(LocalDateTime.now().minusDays(3));
                        postRepository.save(post2);

                        // Post 3: Advanced TypeScript Patterns
                        Post post3 = new Post();
                        post3.setTitle("Advanced TypeScript Patterns");
                        post3.setSlug("advanced-typescript-patterns");
                        post3.setMainImage(
                                        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80");
                        post3.setExcerpt(
                                        "Level up your TypeScript skills with generic types and utility types.");
                        post3.setStatus(PostStatus.PUBLISHED);
                        post3.setContent(
                                        "<h2>Mastering TypeScript</h2><p>TypeScript has become an essential tool for modern web development. In this article, we'll explore advanced patterns that will take your TypeScript skills to the next level.</p><h3>Generic Types</h3><p>Generics allow you to create reusable components that work with multiple types. Learn how to use type parameters to build flexible and type-safe abstractions.</p><h3>Utility Types</h3><p>TypeScript provides several built-in utility types like Partial, Pick, Omit, and Record. Discover how to leverage these powerful tools to manipulate types effectively.</p><h3>Conditional Types</h3><p>Conditional types enable you to create types that depend on other types. This advanced feature opens up new possibilities for type-level programming in TypeScript.</p>");
                        post3.setAuthor(author);
                        post3.setCreatedBy(admin); // Set the user who created it
                        Set<Category> cats3 = new HashSet<>();
                        cats3.add(catTypeScript);
                        post3.setCategories(cats3);
                        post3.setPublishedAt(LocalDateTime.now().minusDays(1));
                        postRepository.save(post3);

                        System.out.println("Data Seeding Completed! Created 3 blog posts.");
                }
        }
}
