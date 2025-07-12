package com.tri.revision.orchild.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrchidResponse(
        String id,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        String origin,
        String color,
        String size,
        boolean isNatural,
        boolean isAvailable,
        LocalDateTime createAt,
        LocalDateTime updateAt,
        String createdByUsername
) {
}
