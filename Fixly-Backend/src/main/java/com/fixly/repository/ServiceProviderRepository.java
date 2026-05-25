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
			    SELECT DISTINCT p
			    FROM ServiceProvider p

			    JOIN FETCH p.category c
			    JOIN FETCH p.user u
			    JOIN FETCH u.addresses a

			    WHERE

			    LOWER(c.name)
			    LIKE LOWER(CONCAT('%', :category, '%'))

			    AND

			    LOWER(a.city)
			    LIKE LOWER(CONCAT('%', :city, '%'))

			    AND (
			        p.status = 'APPROVED'
			        OR
			        p.status = 'SUSPENDED'
			    )
			""")
	List<ServiceProvider> searchProviders(
			@Param("category") String category,
			@Param("city") String city);

	Optional<ServiceProvider> findByUser_UserId(Long userId);

}
