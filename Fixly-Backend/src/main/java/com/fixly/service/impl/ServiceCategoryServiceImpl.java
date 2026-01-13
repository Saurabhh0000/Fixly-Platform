package com.fixly.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.ServiceCategoryRequest;
import com.fixly.dto.response.ServiceCategoryResponse;
import com.fixly.entity.ServiceCategory;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.ServiceCategoryRepository;
import com.fixly.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceCategoryServiceImpl implements ServiceCategoryService{
	
	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Override
	public ServiceCategoryResponse create(ServiceCategoryRequest request) {
		
		ServiceCategory response = new ServiceCategory();
		response.setName(request.getName().toUpperCase());
		response.setDescription(request.getDescription());
		
		ServiceCategory save = categoryRepository.save(response);
		return mapToResponse(save);
	}

	@Override
	public List<ServiceCategoryResponse> getAll() {
		
		List<ServiceCategory> list = categoryRepository.findAll();
		
		return list.stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public void delete(Long id) {
		
		if(!categoryRepository.existsById(id))
		{
			throw new ResourceNotFoundException("Category Not Found !");
		}
		categoryRepository.deleteById(id);
		
	}

	@Override
	public ServiceCategoryResponse update(Long id, ServiceCategoryRequest request) {
		
		ServiceCategory category = categoryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category Not Found !"));
		
		category.setName(request.getName().toUpperCase());
		category.setDescription(request.getDescription());
		
		ServiceCategory save = categoryRepository.save(category);
		
		return mapToResponse(save);
	}
	
	private ServiceCategoryResponse mapToResponse(ServiceCategory category)
	{
		ServiceCategoryResponse response = new ServiceCategoryResponse();
		
		response.setId(category.getServiceId());
		response.setName(category.getName());
		response.setDescription(category.getDescription());
		
		return response;
	}

}
