package com.fixly.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class ProviderStatusBreakdownResponse {
    private long pending;
    private long verifying;
    private long approved;
    private long rejected;
    private long suspended;
    private long total;
    private List<ChartPoint> chart;
}