package com.fixly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fixly.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long>{
	
	List<Address> findByUserUserId(Long userId);
	
	@Query("SELECT DISTINCT TRIM(a.city) FROM Address a WHERE a.city IS NOT NULL")
	List<String> findDistinctCities();


}
