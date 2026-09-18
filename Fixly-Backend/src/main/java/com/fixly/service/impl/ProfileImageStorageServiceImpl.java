package com.fixly.service.impl;

import com.fixly.exception.BadRequestException;
import com.fixly.service.ProfileImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProfileImageStorageServiceImpl implements ProfileImageStorageService {

    private static final long MAX_FILE_SIZE = 2L * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private final Path uploadDirectory =
            Paths.get("./uploads/profile").toAbsolutePath().normalize();

    @Override
    public String store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a profile picture");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Profile picture must be 2 MB or smaller");
        }

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase();

        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new BadRequestException("Only JPG, JPEG, PNG and WEBP images are allowed");
        }

        String extension = extensionFor(contentType);

        try {
            Files.createDirectories(uploadDirectory);

            String fileName = UUID.randomUUID() + extension;
            Path target = uploadDirectory.resolve(fileName).normalize();

            if (!target.getParent().equals(uploadDirectory)) {
                throw new BadRequestException("Invalid profile picture path");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/profile/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Unable to store profile picture", ex);
        }
    }

    @Override
    public void delete(String storedPath) {

        if (storedPath == null || storedPath.isBlank()) {
            return;
        }

        String prefix = "/uploads/profile/";
        if (!storedPath.startsWith(prefix)) {
            return;
        }

        String fileName = storedPath.substring(prefix.length());

        try {
            Path target = uploadDirectory.resolve(fileName).normalize();

            if (target.getParent().equals(uploadDirectory)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ex) {
            // The database remains authoritative. A missing old image should
            // not make an otherwise successful profile update fail.
        }
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new BadRequestException("Unsupported image type");
        };
    }
}
