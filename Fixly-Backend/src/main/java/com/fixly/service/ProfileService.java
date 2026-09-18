package com.fixly.service;

import com.fixly.dto.request.UpdateProfileRequest;
import com.fixly.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    ProfileResponse getMyProfile(String email);

    ProfileResponse updateMyProfile(String email, UpdateProfileRequest request);

    ProfileResponse updateProfilePicture(String email, MultipartFile file);

    ProfileResponse removeProfilePicture(String email);
}
