package com.blog.backend.config;

import com.blog.backend.service.FileUploadSecurityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UploadValidationInterceptor implements HandlerInterceptor {
    private final FileUploadSecurityService fileUploadSecurityService;

    public UploadValidationInterceptor(FileUploadSecurityService fileUploadSecurityService) {
        this.fileUploadSecurityService = fileUploadSecurityService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request instanceof MultipartHttpServletRequest multipartRequest) {
            multipartRequest.getFileMap().values().forEach(fileUploadSecurityService::validate);
        }
        return true;
    }
}
