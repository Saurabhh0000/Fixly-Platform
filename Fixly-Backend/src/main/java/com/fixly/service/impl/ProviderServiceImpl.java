package com.fixly.service.impl;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import com.fixly.entity.Address;
import org.springframework.web.multipart.MultipartFile;

import com.fixly.enums.ProviderStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;
import com.fixly.dto.response.ProviderStatusResponse;
import com.fixly.entity.Address;
import com.fixly.entity.ServiceCategory;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
import com.fixly.dto.response.ProviderVerificationResponse;
import com.fixly.enums.ProviderStatus;
import com.fixly.enums.Role;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.ReviewRepository;
import com.fixly.repository.ServiceCategoryRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.ProviderService;

import jakarta.transaction.Transactional;

@Service
public class ProviderServiceImpl implements ProviderService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private ServiceProviderRepository providerRepository;

	@Autowired
	private ReviewRepository reviewRepository;

	@Transactional
	@Override
	public ProviderResponse registerProvider(
			ProviderRegisterRequest request,
			MultipartFile aadhaarFrontImage,
			MultipartFile aadhaarBackImage) {

		User user = userRepo.findById(request.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"User Not Found"));

		ServiceCategory category = categoryRepository.findById(
				request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Category Not Found"));

		Optional<ServiceProvider> existingProvider = providerRepository.findByUser_UserId(
				user.getUserId());

		// Existing provider found
		if (existingProvider.isPresent()) {

			ServiceProvider provider = existingProvider.get();

			// Allow reapply only if rejected
			if (provider.getStatus() == ProviderStatus.REJECTED) {

				validateImage(aadhaarFrontImage);
				validateImage(aadhaarBackImage);

				provider.setCategory(category);

				provider.setExperienceYears(
						request.getExperienceYears());

				provider.setPricePerVisit(
						request.getPricePerVisit());

				provider.setPanCardNumber(
						request.getPanCardNumber());

				provider.setAadhaarNumber(
						request.getAadhaarNumber());

				provider.setAadhaarFrontImage(
						saveFile(aadhaarFrontImage));

				provider.setAadhaarBackImage(
						saveFile(aadhaarBackImage));

				provider.setStatus(
						ProviderStatus.PENDING);

				provider.setAvailable(false);

				ServiceProvider updated = providerRepository.save(
						provider);

				return mapToResponse(updated);
			}

			throw new BadRequestException(
					"Provider request already exists");
		}

		// New provider application
		validateImage(aadhaarFrontImage);
		validateImage(aadhaarBackImage);

		ServiceProvider provider = new ServiceProvider();

		provider.setUser(user);

		provider.setCategory(category);

		provider.setExperienceYears(
				request.getExperienceYears());

		provider.setPricePerVisit(
				request.getPricePerVisit());

		provider.setPanCardNumber(
				request.getPanCardNumber());

		provider.setAadhaarNumber(
				request.getAadhaarNumber());

		provider.setAadhaarFrontImage(
				saveFile(aadhaarFrontImage));

		provider.setAadhaarBackImage(
				saveFile(aadhaarBackImage));

		provider.setStatus(
				ProviderStatus.PENDING);

		provider.setAvailable(false);

		provider.setRating(0.0);

		ServiceProvider saved = providerRepository.save(provider);

		return mapToResponse(saved);
	}

	private String saveFile(MultipartFile file) {

		try {

			String fileName = System.currentTimeMillis()
					+ "_"
					+ file.getOriginalFilename();

			Path uploadPath = Paths.get("./uploads");
			if (!Files.exists(uploadPath)) {

				Files.createDirectories(uploadPath);
			}

			Path filePath = uploadPath.resolve(fileName);

			Files.copy(
					file.getInputStream(),
					filePath,
					StandardCopyOption.REPLACE_EXISTING);

			return fileName;

		} catch (Exception e) {

			throw new RuntimeException(
					"File upload failed");
		}
	}

	@Override
	public List<ProviderSearchResponse> searchProviders(
			String category,
			String city) {

		return providerRepository
				.searchProviders(category, city)
				.stream()
				.map(this::mapToSearchResponse)
				.toList();
	}

	@Override
	public ProviderStatusResponse getProviderStatus(
			Long userId) {

		ServiceProvider provider = providerRepository
				.findByUser_UserId(userId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		ProviderStatusResponse response = new ProviderStatusResponse();

		response.setProviderId(
				provider.getProviderId());

		response.setStatus(

				provider.getStatus() != null
						? provider.getStatus().name()
						: "PENDING");

		response.setAvailable(
				provider.isAvailable());

		return response;
	}

	@Override
	public List<ProviderVerificationResponse> getAllProviders() {

		return providerRepository.findAll()
				.stream()
				.map(this::mapToVerificationResponse)
				.toList();
	}

	@Override
	@Transactional
	public ProviderResponse approveProvider(Long providerId) {

		ServiceProvider provider = providerRepository.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		provider.setStatus(ProviderStatus.APPROVED);

		provider.setAvailable(true);

		User user = provider.getUser();

		user.setRole(Role.PROVIDER);

		userRepo.save(user);

		providerRepository.save(provider);

		return mapToResponse(provider);
	}

	@Override
	@Transactional
	public ProviderResponse verifyProvider(Long providerId) {

		ServiceProvider provider = providerRepository.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		provider.setStatus(ProviderStatus.VERIFYING);

		providerRepository.save(provider);

		return mapToResponse(provider);
	}

	@Override
	@Transactional
	public ProviderResponse rejectProvider(Long providerId) {

		ServiceProvider provider = providerRepository.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		provider.setStatus(ProviderStatus.REJECTED);

		provider.setAvailable(false);

		providerRepository.save(provider);

		return mapToResponse(provider);
	}

	@Override
	@Transactional
	public ProviderResponse suspendProvider(Long providerId) {

		ServiceProvider provider = providerRepository.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		provider.setStatus(ProviderStatus.SUSPENDED);

		provider.setAvailable(false);

		providerRepository.save(provider);

		return mapToResponse(provider);
	}

	@Override
	@Transactional
	public ProviderResponse unsuspendProvider(Long providerId) {

		ServiceProvider provider = providerRepository.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider Not Found"));

		provider.setStatus(ProviderStatus.APPROVED);

		provider.setAvailable(true);

		providerRepository.save(provider);

		return mapToResponse(provider);
	}

	@Override
	public void updateAvailability(
			Long providerId,
			boolean available) {

		ServiceProvider provider = providerRepository
				.findById(providerId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Provider not found"));

		// ❌ Suspended provider
		// cannot become available

		if (provider.getStatus() == ProviderStatus.SUSPENDED) {

			throw new BadRequestException(
					"Suspended provider cannot change availability");
		}

		provider.setAvailable(available);

		providerRepository.save(provider);
	}

	private ProviderVerificationResponse mapToVerificationResponse(ServiceProvider provider) {

		ProviderVerificationResponse response = new ProviderVerificationResponse();
		Address address = provider.getUser()
				.getAddresses()
				.get(0);

		response.setProviderId(provider.getProviderId());

		response.setUserId(
				provider.getUser().getUserId());

		response.setFullName(
				provider.getUser().getFullName());

		response.setEmail(
				provider.getUser().getEmail());

		response.setPhone(
				provider.getUser().getPhone());

		response.setCategory(
				provider.getCategory().getName());

		response.setExperienceYears(
				provider.getExperienceYears());

		response.setPricePerVisit(
				provider.getPricePerVisit());

		response.setCity(address.getCity());

		response.setArea(
				address.getArea());

		response.setPincode(
				address.getPincode());

		response.setPanCardNumber(
				provider.getPanCardNumber());

		response.setAadhaarNumber(
				provider.getAadhaarNumber());

		response.setAadhaarFrontImage(
				provider.getAadhaarFrontImage());

		response.setAadhaarBackImage(
				provider.getAadhaarBackImage());

		response.setStatus(

				provider.getStatus() != null
						? provider.getStatus().name()
						: "PENDING");

		return response;
	}

	private void validateImage(
			MultipartFile file) {

		String contentType = file.getContentType();

		if (contentType == null ||

				!(contentType.equals("image/jpeg")
						|| contentType.equals("image/jpg")
						|| contentType.equals("image/png"))) {

			throw new BadRequestException(
					"Only JPG, JPEG, PNG files are allowed");
		}

		long maxSize = 1 * 1024 * 1024;

		if (file.getSize() > maxSize) {

			throw new BadRequestException(
					"File size must be less than 1MB");
		}
	}

	private ProviderSearchResponse mapToSearchResponse(ServiceProvider provider) {

		ProviderSearchResponse response = new ProviderSearchResponse();

		response.setProviderId(provider.getProviderId());
		response.setFullName(provider.getUser().getFullName());
		response.setCategory(provider.getCategory().getName());
		response.setExperienceYears(provider.getExperienceYears());
		response.setPricePerVisit(provider.getPricePerVisit());
		// ⭐ Ratings
		response.setRating(provider.getRating());
		response.setRatingCount(
				reviewRepository.countByBookingProviderProviderId(provider.getProviderId()));
		// 🟢 Availability
		response.setAvailable(provider.isAvailable());

		// pick first address (same city guaranteed)
		var address = provider.getUser()
				.getAddresses()
				.get(0);

		response.setCity(address.getCity());
		response.setArea(address.getArea());

		response.setPincode(address.getPincode());
		return response;
	}

	private ProviderResponse mapToResponse(ServiceProvider provider) {
		ProviderResponse response = new ProviderResponse();
		response.setProviderId(provider.getProviderId());
		response.setUserId(provider.getUser().getUserId());
		response.setFullName(provider.getUser().getFullName());

		response.setCategory(provider.getCategory().getName());
		response.setExperienceYears(provider.getExperienceYears());
		response.setPricePerVisit(provider.getPricePerVisit());
		// ⭐ Ratings
		response.setRating(provider.getRating());
		response.setRatingCount(
				reviewRepository.countByBookingProviderProviderId(provider.getProviderId()));

		response.setStatus(

				provider.getStatus() != null
						? provider.getStatus().name()
						: "PENDING");

		// 🟢 Availability
		response.setAvailable(provider.isAvailable());
		return response;
	}

}
