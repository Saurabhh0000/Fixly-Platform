package com.fixly.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fixly.entity.ServiceProvider;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    boolean existsByUserUserId(Long userId);

    @Query("""
    	    SELECT DISTINCT sp
    	    FROM ServiceProvider sp
    	    JOIN sp.user u
    	    LEFT JOIN u.addresses a
    	    WHERE (sp.available = true OR sp.available IS NULL)
    	      AND LOWER(TRIM(sp.category.name)) = LOWER(TRIM(:category))
    	      AND (
    	           a IS NULL
    	           OR LOWER(TRIM(a.city)) = LOWER(TRIM(:city))
    	      )
    	""")
    	List<ServiceProvider> searchProviders(
    	    @Param("category") String category,
    	    @Param("city") String city
    	);
    
    Optional<ServiceProvider> findByUser_UserId(Long userId);



}
