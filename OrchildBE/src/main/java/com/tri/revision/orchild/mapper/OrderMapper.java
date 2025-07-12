package com.tri.revision.orchild.mapper;

import com.tri.revision.orchild.dto.request.OrderCreationRequest;
import com.tri.revision.orchild.dto.request.OrderItemRequest;
import com.tri.revision.orchild.dto.response.OrderItemResponse;
import com.tri.revision.orchild.dto.response.OrderResponse;
import com.tri.revision.orchild.entity.Order;
import com.tri.revision.orchild.entity.OrderItem;
import com.tri.revision.orchild.entity.Orchid;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.OrderStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    /**
     * Convert OrderCreationRequest to Order entity
     */
    public Order toOrder(OrderCreationRequest request, User user, BigDecimal totalAmount) {
        if (request == null) {
            return null;
        }
        return Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.shippingAddress())
                .phoneNumber(request.phoneNumber())
                .notes(request.notes())
                .createAt(LocalDateTime.now())
                .build();
    }

    /**
     * Convert OrderItemRequest to OrderItem entity
     */
    public OrderItem toOrderItem(OrderItemRequest request, Order order, Orchid orchid) {
        if (request == null || order == null || orchid == null) {
            return null;
        }
        
        BigDecimal unitPrice = orchid.getPrice();
        BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(request.quantity()));
        
        return OrderItem.builder()
                .order(order)
                .orchid(orchid)
                .quantity(request.quantity())
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .build();
    }

    /**
     * Convert Order entity to OrderResponse
     */
    public OrderResponse toOrderResponse(Order order) {
        if (order == null) {
            return null;
        }
        
        List<OrderItemResponse> orderItemResponses = order.getOrderItems() != null 
            ? order.getOrderItems().stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList())
            : List.of();
        
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getPhoneNumber(),
                order.getNotes(),
                order.getCreateAt(),
                order.getUpdateAt(),
                orderItemResponses
        );
    }

    /**
     * Convert OrderItem entity to OrderItemResponse
     */
    public OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getOrchid().getId(),
                orderItem.getOrchid().getName(),
                orderItem.getOrchid().getImageUrl(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice()
        );
    }
}
