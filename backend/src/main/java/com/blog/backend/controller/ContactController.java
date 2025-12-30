package com.blog.backend.controller;

import com.blog.backend.dto.ContactRequest;
import com.blog.backend.model.ContactMessage;
import com.blog.backend.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());

        contactMessageRepository.save(message);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Message received successfully");

        return ResponseEntity.ok(response);
    }
}
