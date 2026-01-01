package com.blog.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xslf.usermodel.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
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

            // Compress images in the presentation
            for (XSLFPictureData data : ppt.getPictureData()) {
                byte[] bytes = data.getData();
                if (bytes.length > 500 * 1024) { // Only compress images > 500KB
                    try {
                        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
                        BufferedImage image = ImageIO.read(bais);
                        if (image != null) {
                            // Resize to max 1280px width
                            int targetWidth = 1280;
                            if (image.getWidth() > targetWidth) {
                                int targetHeight = (int) (image.getHeight()
                                        * ((double) targetWidth / image.getWidth()));
                                BufferedImage resized = new BufferedImage(targetWidth, targetHeight,
                                        BufferedImage.TYPE_INT_RGB);
                                Graphics2D g = resized.createGraphics();
                                g.drawImage(image, 0, 0, targetWidth, targetHeight, null);
                                g.dispose();

                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                ImageIO.write(resized, "jpeg", baos);
                                data.setData(baos.toByteArray());
                            }
                        }
                    } catch (Exception e) {
                        // Ignore image errors and continue
                        System.err.println("Failed to compress image: " + e.getMessage());
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
        try {
            InputStream inputStream = file.getInputStream();
            XMLSlideShow ppt = new XMLSlideShow(inputStream);
            PDDocument pdf = new PDDocument();

            for (XSLFSlide slide : ppt.getSlides()) {
                PDPage page = new PDPage(PDRectangle.A4);
                pdf.addPage(page);

                PDPageContentStream contentStream = new PDPageContentStream(pdf, page);
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);

                float yPosition = 750;
                contentStream.beginText();
                contentStream.newLineAtOffset(50, yPosition);
                contentStream.showText("Slide " + slide.getSlideNumber());
                contentStream.endText();
                yPosition -= 30;

                // Extract text from shapes
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape) {
                        XSLFTextShape textShape = (XSLFTextShape) shape;
                        String text = textShape.getText();
                        if (text != null && !text.trim().isEmpty()) {
                            // Basic text wrapping/sanitization
                            String[] lines = text.split("\n");
                            for (String line : lines) {
                                if (yPosition < 50) {
                                    contentStream.close();
                                    page = new PDPage(PDRectangle.A4);
                                    pdf.addPage(page);
                                    contentStream = new PDPageContentStream(pdf, page);
                                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                                    yPosition = 750;
                                }

                                contentStream.beginText();
                                contentStream.newLineAtOffset(50, yPosition);
                                // Clean text for PDF compatibility
                                String cleanLine = line.replaceAll("[^\\x20-\\x7E]", "");
                                contentStream.showText(cleanLine);
                                contentStream.endText();
                                yPosition -= 15;
                            }
                            yPosition -= 10; // Extra space between shapes
                        }
                    }
                }
                contentStream.close();
            }

            ppt.close();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            pdf.save(outputStream);
            pdf.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "converted.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error converting PPT to PDF: " + e.getMessage());
        }
    }
}
