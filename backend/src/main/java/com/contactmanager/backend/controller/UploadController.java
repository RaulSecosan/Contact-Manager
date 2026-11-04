
package com.contactmanager.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file)
            throws IOException {

        if (file.isEmpty() || file.getSize() > 5 * 1024 * 1024) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid file size"
            );
        }

        String type = file.getContentType();
        String extension;

        if ("image/jpeg".equals(type)) {
            extension = ".jpg";
        } else if ("image/png".equals(type)) {
            extension = ".png";
        } else {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Only JPG and PNG images are allowed"
            );
        }

        Path folder = Path.of(uploadDir).toAbsolutePath();
        Files.createDirectories(folder);

        String filename = UUID.randomUUID() + extension;
        Path destination = folder.resolve(filename);

        // Check that the uploaded content is a readable image
        var image = javax.imageio.ImageIO.read(file.getInputStream());

        if (image == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid image"
            );
        }

        Files.copy(file.getInputStream(), destination);

        return Map.of("url", "/uploads/" + filename);
    }
}
