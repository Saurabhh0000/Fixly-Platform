package com.fixly.dto.response;

import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityItem {
    private String type;
    private String title;
    private String message;
    private OffsetDateTime timestamp;
    private String timeAgo;
}