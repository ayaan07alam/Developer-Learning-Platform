package com.blog.backend.service;

public class FileSecurityException extends RuntimeException {
    public FileSecurityException(String message) { super(message); }
    public FileSecurityException(String message, Throwable cause) { super(message, cause); }
}
