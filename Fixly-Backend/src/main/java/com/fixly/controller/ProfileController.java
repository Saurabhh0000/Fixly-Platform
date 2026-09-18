package com.fixly.controller;

import com.fixly.dto.request.UpdateProfileRequest;
import com.fixly.dto.response.ProfileResponse;
import com.fixly.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(
                profileService.getMyProfile(authentication.getName())
        );
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                profileService.updateMyProfile(authentication.getName(), request)
        );
    }

    @PostMapping(value = "/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> updateProfilePicture(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                profileService.updateProfilePicture(authentication.getName(), file)
        );
    }

    @DeleteMapping("/picture")
    public ResponseEntity<ProfileResponse> removeProfilePicture(
            Authentication authentication) {

        return ResponseEntity.ok(
                profileService.removeProfilePicture(authentication.getName())
        );
    }
}
