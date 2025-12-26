package com.blog.backend.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tools/images")
@CrossOrigin(origins = "*")
public class ImageToolsController {

    @PostMapping("/convert")
    public ResponseEntity<?> convertImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("format") String format) {

        try {
            // Read the uploaded image
            BufferedImage image = ImageIO.read(file.getInputStream());

            if (image == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid image file"));
            }

            // Convert to requested format
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            String outputFormat = format.toLowerCase();

            // Handle JPEG/JPG
            if (outputFormat.equals("jpg")) {
                outputFormat = "jpeg";
            }

            ImageIO.write(image, outputFormat, outputStream);
            byte[] imageBytes = outputStream.toByteArray();

            // Set appropriate content type
            String contentType = "image/" + outputFormat;
            if (outputFormat.equals("jpeg")) {
                contentType = "image/jpeg";
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentDispositionFormData("attachment",
                    "converted." + format.toLowerCase());

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to convert image: " + e.getMessage()));
        }
    }

    @PostMapping("/resize")
    public ResponseEntity<?> resizeImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("width") int width,
            @RequestParam("height") int height,
            @RequestParam(value = "maintain", defaultValue = "true") boolean maintainAspectRatio) {

        try {
            BufferedImage originalImage = ImageIO.read(file.getInputStream());

            if (originalImage == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid image file"));
            }

            // Calculate dimensions if maintaining aspect ratio
            int targetWidth = width;
            int targetHeight = height;

            if (maintainAspectRatio) {
                double aspectRatio = (double) originalImage.getWidth() / originalImage.getHeight();
                if (width > 0 && height == 0) {
                    targetWidth = width;
                    targetHeight = (int) (width / aspectRatio);
                } else if (height > 0 && width == 0) {
                    targetHeight = height;
                    targetWidth = (int) (height * aspectRatio);
                }
            }

            // Resize image
            Image scaledImage = originalImage.getScaledInstance(
                    targetWidth, targetHeight, Image.SCALE_SMOOTH);

            BufferedImage resizedImage = new BufferedImage(
                    targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);

            Graphics2D g2d = resizedImage.createGraphics();
            g2d.drawImage(scaledImage, 0, 0, null);
            g2d.dispose();

            // Convert to bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpg", outputStream);
            byte[] imageBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setContentDispositionFormData("attachment", "resized.jpg");

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to resize image: " + e.getMessage()));
        }
    }

    @PostMapping("/compress")
    public ResponseEntity<?> compressImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "quality", defaultValue = "0.8") float quality) {

        try {
            BufferedImage image = ImageIO.read(file.getInputStream());

            if (image == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid image file"));
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", outputStream);
            byte[] compressedBytes = outputStream.toByteArray();

            // Return file info
            Map<String, Object> result = new HashMap<>();
            result.put("originalSize", file.getSize());
            result.put("compressedSize", compressedBytes.length);
            result.put("reduction",
                    String.format("%.1f%%", (1 - (double) compressedBytes.length / file.getSize()) * 100));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setContentDispositionFormData("attachment", "compressed.jpg");

            return new ResponseEntity<>(compressedBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to compress image: " + e.getMessage()));
        }
    }

    @GetMapping("/formats")
    public ResponseEntity<?> getSupportedFormats() {
        Map<String, Object> formats = new HashMap<>();
        formats.put("input", new String[] { "jpg", "jpeg", "png", "gif", "bmp" });
        formats.put("output", new String[] { "jpg", "png", "webp" });
        return ResponseEntity.ok(formats);
    }
}
