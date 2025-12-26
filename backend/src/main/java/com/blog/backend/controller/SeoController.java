package com.blog.backend.controller;

import com.blog.backend.model.Post;
import com.blog.backend.model.Job;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seo")
@CrossOrigin(origins = "*")
public class SeoController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private JobRepository jobRepository;

    private static final String BASE_URL = "https://yourwebsite.com";

    /**
     * Generate sitemap for blog posts
     */
    @GetMapping(value = "/sitemap-blog.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateBlogSitemap() {
        List<Post> publishedPosts = postRepository.findByStatus("PUBLISHED");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        for (Post post : publishedPosts) {
            xml.append("  <url>\n");
            xml.append("    <loc>").append(BASE_URL).append("/blog/").append(post.getSlug()).append("</loc>\n");
            xml.append("    <lastmod>").append(formatDate(post.getUpdatedAt())).append("</lastmod>\n");
            xml.append("    <changefreq>monthly</changefreq>\n");
            xml.append("    <priority>0.8</priority>\n");
            xml.append("  </url>\n");
        }

        xml.append("</urlset>");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    /**
     * Generate sitemap for job postings
     */
    @GetMapping(value = "/sitemap-jobs.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateJobsSitemap() {
        List<Job> activeJobs = jobRepository.findByStatus("ACTIVE");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        for (Job job : activeJobs) {
            xml.append("  <url>\n");
            xml.append("    <loc>").append(BASE_URL).append("/jobs/").append(job.getId()).append("</loc>\n");
            xml.append("    <lastmod>").append(formatDate(job.getUpdatedAt())).append("</lastmod>\n");
            xml.append("    <changefreq>weekly</changefreq>\n");
            xml.append("    <priority>0.7</priority>\n");
            xml.append("  </url>\n");
        }

        xml.append("</urlset>");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    /**
     * Generate master sitemap index
     */
    @GetMapping(value = "/sitemap-index.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateSitemapIndex() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // Blog sitemap
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(BASE_URL).append("/api/seo/sitemap-blog.xml</loc>\n");
        xml.append("    <lastmod>").append(formatDate(LocalDateTime.now())).append("</lastmod>\n");
        xml.append("  </sitemap>\n");

        // Jobs sitemap
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(BASE_URL).append("/api/seo/sitemap-jobs.xml</loc>\n");
        xml.append("    <lastmod>").append(formatDate(LocalDateTime.now())).append("</lastmod>\n");
        xml.append("  </sitemap>\n");

        // Tools sitemap (static file)
        xml.append("  <sitemap>\n");
        xml.append("    <loc>").append(BASE_URL).append("/sitemap.xml</loc>\n");
        xml.append("    <lastmod>").append(formatDate(LocalDateTime.now())).append("</lastmod>\n");
        xml.append("  </sitemap>\n");

        xml.append("</sitemapindex>");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    /**
     * Generate RSS feed for blog
     */
    @GetMapping(value = "/feed.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> generateRssFeed() {
        List<Post> recentPosts = postRepository.findTop20ByStatusOrderByPublishedAtDesc("PUBLISHED");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n");
        xml.append("  <channel>\n");
        xml.append("    <title>Your Website Blog</title>\n");
        xml.append("    <link>").append(BASE_URL).append("/blog</link>\n");
        xml.append("    <description>Latest articles and tutorials</description>\n");
        xml.append("    <language>en-us</language>\n");
        xml.append("    <atom:link href=\"").append(BASE_URL)
                .append("/api/seo/feed.xml\" rel=\"self\" type=\"application/rss+xml\"/>\n");

        for (Post post : recentPosts) {
            xml.append("    <item>\n");
            xml.append("      <title>").append(escapeXml(post.getTitle())).append("</title>\n");
            xml.append("      <link>").append(BASE_URL).append("/blog/").append(post.getSlug()).append("</link>\n");
            xml.append("      <description>").append(escapeXml(post.getExcerpt() != null ? post.getExcerpt() : ""))
                    .append("</description>\n");
            xml.append("      <pubDate>").append(formatRssDate(post.getPublishedAt())).append("</pubDate>\n");
            xml.append("      <guid>").append(BASE_URL).append("/blog/").append(post.getSlug()).append("</guid>\n");
            xml.append("    </item>\n");
        }

        xml.append("  </channel>\n");
        xml.append("</rss>");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml.toString());
    }

    /**
     * Format date for sitemap (ISO 8601)
     */
    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            dateTime = LocalDateTime.now();
        }
        return dateTime.format(DateTimeFormatter.ISO_DATE);
    }

    /**
     * Format date for RSS feed (RFC 822)
     */
    private String formatRssDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            dateTime = LocalDateTime.now();
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z");
        return dateTime.format(formatter);
    }

    /**
     * Escape XML special characters
     */
    private String escapeXml(String text) {
        if (text == null)
            return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
