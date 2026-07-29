package com.blog.backend.controller;

import com.blog.backend.model.UploadedImage;
import com.blog.backend.repository.UploadedImageRepository;
import com.blog.backend.service.CloudinaryService;
import com.blog.backend.service.FileUploadSecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final CloudinaryService cloudinaryService;
    private final UploadedImageRepository uploadedImageRepository;
    private final FileUploadSecurityService fileUploadSecurityService;

    public MediaController(CloudinaryService cloudinaryService, UploadedImageRepository uploadedImageRepository,
            FileUploadSecurityService fileUploadSecurityService) {
        this.cloudinaryService = cloudinaryService;
        this.uploadedImageRepository = uploadedImageRepository;
        this.fileUploadSecurityService = fileUploadSecurityService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            fileUploadSecurityService.validate(file);
            // Upload to Cloudinary
            Map<?, ?> result = cloudinaryService.uploadFile(file);

            String url = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");

            // Save metadata to DB
            UploadedImage image = new UploadedImage();
            image.setUrl(url);
            image.setPublicId(publicId);
            image.setOriginalFilename(fileUploadSecurityService.safeFileName(file.getOriginalFilename()));

            uploadedImageRepository.save(image);

            return ResponseEntity.ok().body(new FileUploadResponse(
                    file.getOriginalFilename(),
                    url,
                    file.getContentType(),
                    file.getSize()));

        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Could not upload file"));
        }
    }

    @GetMapping
    public ResponseEntity<List<String>> listFiles() {
        try {
            List<String> urls = uploadedImageRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(UploadedImage::getUrl)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(urls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // DTO Helper
    static class FileUploadResponse {
        public String fileName;
        public String fileDownloadUri;
        public String fileType;
        public long size;

        public FileUploadResponse(String fileName, String fileDownloadUri, String fileType, long size) {
            this.fileName = fileName;
            this.fileDownloadUri = fileDownloadUri;
            this.fileType = fileType;
            this.size = size;
        }
    }
}
