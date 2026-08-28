package com.fixly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingTrendPoint {
    private String period;
    private long total;
    private long completed;
    private long pending;
    private long accepted;
    private long cancelled;
}