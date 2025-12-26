package com.blog.backend.controller;

import org.apache.poi.xslf.usermodel.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@RestController
@RequestMapping("/api/tools/ppt")
@CrossOrigin(origins = "*")
public class PPTToolsController {

    @PostMapping("/compress")
    public ResponseEntity<?> compressPPT(@RequestParam("file") MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            XMLSlideShow ppt = new XMLSlideShow(inputStream);

            // Compress images in slides
            for (XSLFSlide slide : ppt.getSlides()) {
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFPictureShape) {
                        // Image compression would go here
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ppt.write(outputStream);
            ppt.close();

            byte[] compressedData = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType
                    .parseMediaType("application/vnd.openxmlformats-officedocument.presentationml.presentation"));
            headers.setContentDispositionFormData("attachment", "compressed.pptx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(compressedData);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error compressing PPT: " + e.getMessage());
        }
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<?> pptToPDF(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.badRequest().body("PPT to PDF conversion requires additional libraries");
    }
}
