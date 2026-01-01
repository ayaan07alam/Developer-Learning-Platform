package com.blog.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Iterator;

@RestController
@RequestMapping("/api/tools/excel")
@CrossOrigin(origins = "*")
public class ExcelToolsController {

    @PostMapping("/compress")
    public ResponseEntity<?> compressExcel(@RequestParam("file") MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(inputStream);

            // Remove unused sheets and optimize
            int totalSheets = workbook.getNumberOfSheets();
            for (int i = totalSheets - 1; i >= 0; i--) {
                Sheet sheet = workbook.getSheetAt(i);
                if (sheet.getPhysicalNumberOfRows() == 0) {
                    workbook.removeSheetAt(i);
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            byte[] compressedData = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "compressed.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(compressedData);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error compressing Excel: " + e.getMessage());
        }
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<?> excelToPDF(@RequestParam("file") MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(inputStream);
            PDDocument pdf = new PDDocument();

            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                PDPage page = new PDPage(PDRectangle.A4);
                pdf.addPage(page);

                PDPageContentStream contentStream = new PDPageContentStream(pdf, page);
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);

                float yPosition = 750;
                float margin = 50;

                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Sheet: " + sheet.getSheetName());
                contentStream.endText();
                yPosition -= 20;

                contentStream.setFont(PDType1Font.HELVETICA, 10);

                Iterator<Row> rowIterator = sheet.rowIterator();
                while (rowIterator.hasNext()) {
                    Row row = rowIterator.next();
                    Iterator<Cell> cellIterator = row.cellIterator();

                    float xPosition = margin;

                    if (yPosition < 50) {
                        contentStream.close();
                        page = new PDPage(PDRectangle.A4);
                        pdf.addPage(page);
                        contentStream = new PDPageContentStream(pdf, page);
                        contentStream.setFont(PDType1Font.HELVETICA, 10);
                        yPosition = 750;
                    }

                    while (cellIterator.hasNext()) {
                        Cell cell = cellIterator.next();
                        String cellValue = "";

                        switch (cell.getCellType()) {
                            case STRING:
                                cellValue = cell.getStringCellValue();
                                break;
                            case NUMERIC:
                                cellValue = String.valueOf(cell.getNumericCellValue());
                                break;
                            case BOOLEAN:
                                cellValue = String.valueOf(cell.getBooleanCellValue());
                                break;
                            default:
                                cellValue = "";
                        }

                        if (!cellValue.isEmpty()) {
                            contentStream.beginText();
                            contentStream.newLineAtOffset(xPosition, yPosition);
                            // Sanitize text
                            String cleanText = cellValue.replaceAll("[^\\x20-\\x7E]", "");
                            // Truncate if too long to prevent overwrite
                            if (cleanText.length() > 20)
                                cleanText = cleanText.substring(0, 17) + "...";
                            contentStream.showText(cleanText);
                            contentStream.endText();
                        }
                        xPosition += 100; // Fixed column width
                    }
                    yPosition -= 15;
                }
                contentStream.close();
            }

            workbook.close();
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
            return ResponseEntity.badRequest().body("Error converting Excel to PDF: " + e.getMessage());
        }
    }
}
