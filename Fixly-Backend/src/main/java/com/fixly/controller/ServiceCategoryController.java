package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ServiceCategoryRequest;
import com.fixly.dto.response.ServiceCategoryResponse;
import com.fixly.service.ServiceCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class ServiceCategoryController {
	
	@Autowired
	private ServiceCategoryService categoryService;
	
    // ADMIN

	@PostMapping
	public ResponseEntity<ServiceCategoryResponse> create(@RequestBody ServiceCategoryRequest request)
	{
		ServiceCategoryResponse response = categoryService.create(request);
		return ResponseEntity.ok(response);
	}

	// PUBLIC
	
	@GetMapping
	public ResponseEntity<List<ServiceCategoryResponse>> getAll()
	{
		List<ServiceCategoryResponse> list = categoryService.getAll();
		return ResponseEntity.ok(list);
	}
	
	// ADMIN
	
	@PutMapping("/{id}")
	public ResponseEntity<ServiceCategoryResponse> update(@PathVariable Long id, @RequestBody ServiceCategoryRequest request)
	{
		ServiceCategoryResponse update = categoryService.update(id, request);
		return ResponseEntity.ok(update);
		
	}
	
	// ADMIN 
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> delete(@PathVariable Long id)
	{
		categoryService.delete(id);
		
		return ResponseEntity.ok("Category deleted successfully");
	}
}
