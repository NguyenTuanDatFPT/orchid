package com.tri.revision.orchild.dto.response;

import java.math.BigDecimal;

public record OrderItemResponse(
        String id,
        String orchidId,
        String orchidName,
        String orchidImageUrl,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {
}
