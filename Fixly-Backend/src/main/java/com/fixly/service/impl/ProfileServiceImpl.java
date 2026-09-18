package com.fixly.service.impl;

import com.fixly.dto.request.UpdateProfileRequest;
import com.fixly.dto.response.ProfileResponse;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
import com.fixly.enums.NotificationType;
import com.fixly.repository.UserRepository;
import com.fixly.service.NotificationService;
import com.fixly.service.ProfileImageStorageService;
import com.fixly.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ProfileImageStorageService profileImageStorageService;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(String email) {
        return mapToResponse(findUser(email));
    }

    @Override
    @Transactional
    public ProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {

        User user = findUser(email);

        String oldName = user.getFullName();
        String oldPhone = user.getPhone();

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());

        boolean nameChanged = !safeEquals(oldName, user.getFullName());
        boolean phoneChanged = !safeEquals(oldPhone, user.getPhone());

        if (!nameChanged && !phoneChanged) {
            return mapToResponse(user);
        }

        userRepository.save(user);

        if (nameChanged && phoneChanged) {
            notificationService.send(
                    user.getUserId(),
                    "Profile updated",
                    "Your name and phone number were updated successfully.",
                    NotificationType.PROFILE);
        } else if (nameChanged) {
            notificationService.send(
                    user.getUserId(),
                    "Name updated",
                    "Your profile name was updated successfully.",
                    NotificationType.PROFILE);
        } else {
            notificationService.send(
                    user.getUserId(),
                    "Phone number updated",
                    "Your phone number was updated successfully.",
                    NotificationType.PROFILE);
        }

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfilePicture(String email, MultipartFile file) {

        User user = findUser(email);

        String oldPicture = user.getProfilePicture();
        String newPicture = profileImageStorageService.store(file);

        user.setProfilePicture(newPicture);
        userRepository.save(user);

        if (oldPicture != null && !oldPicture.isBlank()) {
            profileImageStorageService.delete(oldPicture);
        }

        notificationService.send(
                user.getUserId(),
                "Profile picture updated",
                "Your profile picture was changed successfully.",
                NotificationType.PROFILE_PICTURE);

        return mapToResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse removeProfilePicture(String email) {

        User user = findUser(email);

        String oldPicture = user.getProfilePicture();

        if (oldPicture == null || oldPicture.isBlank()) {
            return mapToResponse(user);
        }

        user.setProfilePicture(null);
        userRepository.save(user);
        profileImageStorageService.delete(oldPicture);

        notificationService.send(
                user.getUserId(),
                "Profile picture removed",
                "Your profile picture was removed successfully.",
                NotificationType.PROFILE_PICTURE);

        return mapToResponse(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User With This Email Not Found!"));
    }

    private ProfileResponse mapToResponse(User user) {

        ServiceProvider provider = user.getServiceProvider();

        ProfileResponse.ProviderProfileData providerData = null;

        if (provider != null) {
            providerData = ProfileResponse.ProviderProfileData.builder()
                    .providerId(provider.getProviderId())
                    .category(provider.getCategory() != null
                            ? provider.getCategory().getName()
                            : null)
                    .experienceYears(provider.getExperienceYears())
                    .pricePerVisit(provider.getPricePerVisit())
                    .rating(provider.getRating())
                    .available(provider.isAvailable())
                    .status(provider.getStatus() != null
                            ? provider.getStatus().name()
                            : null)
                    .build();
        }

        return ProfileResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .active(user.isActive())
                .provider(providerData)
                .build();
    }

    private boolean safeEquals(String first, String second) {
        return first == null ? second == null : first.equals(second);
    }
}
