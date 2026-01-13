package com.fixly.entity;


import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fixly.enums.BookingStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    private LocalDate serviceDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String otp;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Review review;
}
