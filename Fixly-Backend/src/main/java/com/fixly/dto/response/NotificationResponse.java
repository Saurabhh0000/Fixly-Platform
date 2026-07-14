package com.fixly.dto.response;

import com.fixly.enums.NotificationType;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private NotificationType type;

    private Long referenceId;

    private boolean read;

    private OffsetDateTime createdAt;
}
