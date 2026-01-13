package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.ServiceCategoryRequest;
import com.fixly.dto.response.ServiceCategoryResponse;

public interface ServiceCategoryService {
	
	ServiceCategoryResponse create(ServiceCategoryRequest request);
	List<ServiceCategoryResponse> getAll();
	void delete(Long id);
	ServiceCategoryResponse update(Long id, ServiceCategoryRequest request);

}
