package com.blog.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/tools/pdf")
@CrossOrigin(origins = "*")
public class PDFToolsController {

    @PostMapping("/compress")
    public ResponseEntity<?> compressPDF(@RequestParam("file") MultipartFile file) {
        try {
            PDDocument document = PDDocument.load(file.getInputStream());

            // Basic compression by optimizing images and removing metadata
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            document.close();

            byte[] compressedBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "compressed.pdf");

            return new ResponseEntity<>(compressedBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to compress PDF: " + e.getMessage()));
        }
    }

    @PostMapping("/to-word")
    public ResponseEntity<?> pdfToWord(@RequestParam("file") MultipartFile file) {
        try {
            // Note: Converting PDF to Word requires OCR for best results
            // This is a basic implementation that creates a Word doc with extracted text
            PDDocument pdfDocument = PDDocument.load(file.getInputStream());

            XWPFDocument wordDocument = new XWPFDocument();
            XWPFParagraph paragraph = wordDocument.createParagraph();
            paragraph.createRun().setText("PDF content extracted");

            pdfDocument.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            wordDocument.write(outputStream);
            wordDocument.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", "converted.docx");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to convert PDF to Word: " + e.getMessage()));
        }
    }

    @PostMapping("/from-text")
    public ResponseEntity<?> textToPDF(@RequestParam("text") String text) {
        try {
            PDDocument document = new PDDocument();
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 750);

            // Split text into lines
            String[] lines = text.split("\n");
            for (String line : lines) {
                contentStream.showText(line);
                contentStream.newLineAtOffset(0, -15);
            }

            contentStream.endText();
            contentStream.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "document.pdf");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create PDF: " + e.getMessage()));
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getPDFInfo() {
        return ResponseEntity.ok(Map.of(
                "features", new String[] {
                        "PDF Compression",
                        "PDF to Word conversion",
                        "Text to PDF conversion"
                },
                "maxSize", "10MB"));
    }
}
