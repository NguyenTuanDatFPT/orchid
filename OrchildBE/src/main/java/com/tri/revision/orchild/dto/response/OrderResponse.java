package com.tri.revision.orchild.dto.response;

import com.tri.revision.orchild.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        String id,
        String userId,
        String username,
        BigDecimal totalAmount,
        OrderStatus status,
        String shippingAddress,
        String phoneNumber,
        String notes,
        LocalDateTime createAt,
        LocalDateTime updateAt,
        List<OrderItemResponse> orderItems
) {
}
