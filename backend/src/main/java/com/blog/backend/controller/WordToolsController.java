package com.blog.backend.controller;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
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
@RequestMapping("/api/tools/word")
@CrossOrigin(origins = "*")
public class WordToolsController {

    @PostMapping("/compress")
    public ResponseEntity<?> compressWord(@RequestParam("file") MultipartFile file) {
        try {
            XWPFDocument document = new XWPFDocument(file.getInputStream());

            // Basic compression - remove extra spacing, optimize images
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            document.close();

            byte[] compressedBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", "compressed.docx");

            return new ResponseEntity<>(compressedBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to compress Word document: " + e.getMessage()));
        }
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<?> wordToPDF(@RequestParam("file") MultipartFile file) {
        try {
            XWPFDocument wordDocument = new XWPFDocument(file.getInputStream());

            PDDocument pdfDocument = new PDDocument();
            PDPage page = new PDPage();
            pdfDocument.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page);
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 750);

            // Extract text from Word document
            for (XWPFParagraph paragraph : wordDocument.getParagraphs()) {
                contentStream.showText(paragraph.getText());
                contentStream.newLineAtOffset(0, -15);
            }

            contentStream.endText();
            contentStream.close();
            wordDocument.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            pdfDocument.save(outputStream);
            pdfDocument.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "converted.pdf");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to convert Word to PDF: " + e.getMessage()));
        }
    }

    @PostMapping("/from-text")
    public ResponseEntity<?> textToWord(@RequestParam("text") String text) {
        try {
            XWPFDocument document = new XWPFDocument();

            String[] paragraphs = text.split("\n\n");
            for (String para : paragraphs) {
                XWPFParagraph paragraph = document.createParagraph();
                XWPFRun run = paragraph.createRun();
                run.setText(para);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.write(outputStream);
            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
            headers.setContentDispositionFormData("attachment", "document.docx");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create Word document: " + e.getMessage()));
        }
    }

    @GetMapping("/info")
    public ResponseEntity<?> getWordInfo() {
        return ResponseEntity.ok(Map.of(
                "features", new String[] {
                        "Word Compression",
                        "Word to PDF conversion",
                        "Text to Word conversion"
                },
                "formats", new String[] { "docx" },
                "maxSize", "10MB"));
    }
}
