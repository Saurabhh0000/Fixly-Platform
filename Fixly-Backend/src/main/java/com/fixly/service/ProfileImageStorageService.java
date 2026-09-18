package com.fixly.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageStorageService {

    String store(MultipartFile file);

    void delete(String storedPath);
}
