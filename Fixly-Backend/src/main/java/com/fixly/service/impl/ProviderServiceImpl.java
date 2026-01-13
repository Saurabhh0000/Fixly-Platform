package com.fixly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;
import com.fixly.entity.ServiceCategory;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
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
public class ProviderServiceImpl implements ProviderService{
	
	
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
    public ProviderResponse registerProvider(ProviderRegisterRequest request) {

        User user = userRepo.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        if (providerRepository.existsByUserUserId(user.getUserId())) {
            throw new BadRequestException("User already registered as Provider");
        }

        ServiceCategory category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category Not Found"));

        ServiceProvider provider = new ServiceProvider();
        provider.setUser(user);
        provider.setCategory(category);
        provider.setExperienceYears(request.getExperienceYears());
        provider.setPricePerVisit(request.getPricePerVisit());
        provider.setAvailable(true);
        provider.setRating(0.0);

        ServiceProvider saved = providerRepository.save(provider);

        user.setRole(Role.PROVIDER);
        userRepo.save(user);

        return mapToResponse(saved);
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
	        reviewRepository.countByBookingProviderProviderId(provider.getProviderId())
	    );
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
	
	private ProviderResponse mapToResponse(ServiceProvider provider)
	{
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
            reviewRepository.countByBookingProviderProviderId(provider.getProviderId())
        );

        // 🟢 Availability
        response.setAvailable(provider.isAvailable());
        return response;
	}

}
