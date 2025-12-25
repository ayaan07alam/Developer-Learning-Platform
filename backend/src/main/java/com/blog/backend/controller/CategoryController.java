package com.blog.backend.controller;

import com.blog.backend.dto.CategoryDTO;
import com.blog.backend.model.Category;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import com.blog.backend.repository.CategoryRepository;
import com.blog.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PostRepository postRepository;

    // Get all categories
    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<Category> categories = categoryRepository.findAllByOrderByNameAsc();

        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(cat -> {
                    long postCount = postRepository.findAll().stream()
                            .filter(post -> post.getCategories() != null &&
                                    post.getCategories().stream().anyMatch(c -> c.getId().equals(cat.getId())))
                            .count();
                    return new CategoryDTO(cat.getId(), cat.getName(), cat.getSlug(),
                            cat.getDescription(), postCount);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryDTOs);
    }

    // Get category by slug
    @GetMapping("/{slug}")
    public ResponseEntity<?> getCategoryBySlug(@PathVariable String slug) {
        Optional<Category> categoryOpt = categoryRepository.findBySlug(slug);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found"));
        }

        Category cat = categoryOpt.get();
        long postCount = postRepository.findAll().stream()
                .filter(post -> post.getCategories() != null &&
                        post.getCategories().stream().anyMatch(c -> c.getId().equals(cat.getId())))
                .count();

        CategoryDTO dto = new CategoryDTO(cat.getId(), cat.getName(), cat.getSlug(),
                cat.getDescription(), postCount);
        return ResponseEntity.ok(dto);
    }

    // Create category (ADMIN only)
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can create categories"));
        }

        // Auto-generate slug if not provided
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(generateSlug(category.getName()));
        }

        // Check if slug already exists
        if (categoryRepository.findBySlug(category.getSlug()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Category with this slug already exists"));
        }

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    // Update category (ADMIN only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
            @RequestBody Category categoryUpdate, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can update categories"));
        }

        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found"));
        }

        Category category = categoryOpt.get();

        if (categoryUpdate.getName() != null) {
            category.setName(categoryUpdate.getName());
        }
        if (categoryUpdate.getSlug() != null) {
            // Check if new slug conflicts with existing category
            Optional<Category> existingCat = categoryRepository.findBySlug(categoryUpdate.getSlug());
            if (existingCat.isPresent() && !existingCat.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Category with this slug already exists"));
            }
            category.setSlug(categoryUpdate.getSlug());
        }
        if (categoryUpdate.getDescription() != null) {
            category.setDescription(categoryUpdate.getDescription());
        }

        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete category (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can delete categories"));
        }

        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Category not found"));
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    // Helper method to generate slug from name
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
