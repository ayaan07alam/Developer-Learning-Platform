package com.blog.backend.config;

import com.blog.backend.model.Category;
import com.blog.backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            List<CategoryData> initialCategories = Arrays.asList(
                    new CategoryData("Careers & Jobs", "careers-and-jobs", "Job market & career advice"),
                    new CategoryData("Interview Experiences", "interview-experiences", "Real stories from candidates"),
                    new CategoryData("Interview Questions", "interview-questions", "Prepare for your dream job"),
                    new CategoryData("Roadmaps", "roadmaps", "Step-by-step learning paths"),
                    new CategoryData("Tech Insights", "tech-insights", "Latest tech revolution & updates"),
                    new CategoryData("Trending", "trending", "What everyone is reading"));

            for (CategoryData data : initialCategories) {
                if (categoryRepository.findBySlug(data.slug).isEmpty()) {
                    Category category = new Category();
                    category.setName(data.name);
                    category.setSlug(data.slug);
                    category.setDescription(data.description);
                    categoryRepository.save(category);
                    System.out.println("Seeded category: " + data.name);
                }
            }
        };
    }

    private static class CategoryData {
        String name;
        String slug;
        String description;

        public CategoryData(String name, String slug, String description) {
            this.name = name;
            this.slug = slug;
            this.description = description;
        }
    }
}
