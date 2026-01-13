package com.fixly.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Review {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long reviewId;
	
	// ✅ VERY IMPORTANT
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    @JsonBackReference
    private Booking booking;
	
	private double rating;
	
	private String comment;
	

}
