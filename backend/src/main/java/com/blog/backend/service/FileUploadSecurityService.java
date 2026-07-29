package com.blog.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;

@Service
public class FileUploadSecurityService {
    private static final Set<String> EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "bmp", "webp", "pdf",
            "doc", "docx", "xls", "xlsx", "ppt", "pptx");
    private final long maxBytes;
    private final AntivirusService antivirusService;

    public FileUploadSecurityService(@Value("${upload.max-bytes:10485760}") long maxBytes,
            AntivirusService antivirusService) {
        this.maxBytes = maxBytes;
        this.antivirusService = antivirusService;
    }

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new FileSecurityException("A non-empty file is required");
        if (file.getSize() > maxBytes) throw new FileSecurityException("File exceeds the permitted upload size");
        String extension = extension(file.getOriginalFilename());
        if (!EXTENSIONS.contains(extension) || !hasExpectedSignature(file, extension)) {
            throw new FileSecurityException("The file type is not permitted or its contents do not match its extension");
        }
        antivirusService.scan(file);
    }

    public String safeFileName(String originalName) {
        String fileName = Paths.get(originalName == null ? "upload" : originalName).getFileName().toString();
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String extension(String name) {
        String safeName = safeFileName(name);
        int dot = safeName.lastIndexOf('.');
        return dot < 1 ? "" : safeName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private boolean hasExpectedSignature(MultipartFile file, String extension) {
        try (InputStream stream = file.getInputStream()) {
            byte[] header = stream.readNBytes(8);
            return switch (extension) {
                case "jpg", "jpeg" -> header.length >= 3 && (header[0] & 0xff) == 0xff && (header[1] & 0xff) == 0xd8 && (header[2] & 0xff) == 0xff;
                case "png" -> header.length >= 8 && header[0] == (byte) 0x89 && header[1] == 0x50 && header[2] == 0x4e && header[3] == 0x47;
                case "gif" -> header.length >= 6 && header[0] == 'G' && header[1] == 'I' && header[2] == 'F';
                case "bmp" -> header.length >= 2 && header[0] == 'B' && header[1] == 'M';
                case "pdf" -> header.length >= 5 && header[0] == '%' && header[1] == 'P' && header[2] == 'D' && header[3] == 'F' && header[4] == '-';
                case "doc", "xls", "ppt" -> header.length >= 8 && (header[0] & 0xff) == 0xd0 && (header[1] & 0xff) == 0xcf && (header[2] & 0xff) == 0x11 && (header[3] & 0xff) == 0xe0;
                case "docx", "xlsx", "pptx" -> header.length >= 4 && header[0] == 'P' && header[1] == 'K' && header[2] == 3 && header[3] == 4;
                case "webp" -> header.length >= 4 && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F';
                default -> false;
            };
        } catch (IOException exception) {
            throw new FileSecurityException("Could not inspect the uploaded file", exception);
        }
    }
}
