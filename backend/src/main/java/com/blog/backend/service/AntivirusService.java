package com.blog.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

/** Streams uploads to ClamAV's INSTREAM protocol; files never need a local staging copy. */
@Service
public class AntivirusService {
    private final boolean enabled;
    private final String host;
    private final int port;

    public AntivirusService(@Value("${upload.antivirus.enabled:true}") boolean enabled,
            @Value("${upload.antivirus.host:clamav}") String host,
            @Value("${upload.antivirus.port:3310}") int port) {
        this.enabled = enabled;
        this.host = host;
        this.port = port;
    }

    public void scan(MultipartFile file) {
        if (!enabled) return;
        try (Socket socket = new Socket(host, port);
             DataOutputStream output = new DataOutputStream(socket.getOutputStream());
             InputStream input = file.getInputStream()) {
            socket.setSoTimeout(30_000);
            output.write("zINSTREAM\0".getBytes(StandardCharsets.US_ASCII));
            byte[] buffer = new byte[8192];
            for (int read; (read = input.read(buffer)) != -1;) {
                output.writeInt(read);
                output.write(buffer, 0, read);
            }
            output.writeInt(0);
            output.flush();
            String result = new String(socket.getInputStream().readAllBytes(), StandardCharsets.US_ASCII);
            if (!result.contains("OK")) throw new FileSecurityException("The uploaded file was rejected by malware scanning");
        } catch (IOException exception) {
            // A required scanner failing must never silently turn into an unscanned upload.
            throw new FileSecurityException("Upload scanning is temporarily unavailable", exception);
        }
    }
}
