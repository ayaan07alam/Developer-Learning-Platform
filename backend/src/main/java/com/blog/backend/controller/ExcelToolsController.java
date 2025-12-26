package com.blog.backend.controller;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

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
        return ResponseEntity.badRequest().body("Excel to PDF conversion requires additional libraries");
    }
}
