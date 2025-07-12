package com.tri.revision.orchild.controller;

import com.tri.revision.orchild.dto.request.OrderCreationRequest;
import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.dto.response.OrderResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.enums.OrderStatus;
import com.tri.revision.orchild.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;

    /**
     * Create new order (USER)
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<Void> createOrder(@Valid @RequestBody OrderCreationRequest request) {
        return ApiResponse.<Void>builder()
                .message(orderService.createOrder(request))
                .build();
    }

    /**
     * Get all orders with filters and pagination (ADMIN/STAFF only)
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) OrderStatus status) {
        
        PageResponse<OrderResponse> orders = orderService.getAllOrders(
                page, size, sortBy, sortDirection, userId, status);
        
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .payload(orders)
                .build();
    }

    /**
     * Get my orders (USER)
     */
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<PageResponse<OrderResponse>> getMyOrders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        PageResponse<OrderResponse> orders = orderService.getMyOrders(
                page, size, sortBy, sortDirection);
        
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .payload(orders)
                .build();
    }

    /**
     * Get order by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .payload(orderService.getOrderById(id))
                .build();
    }

    /**
     * Update order status (ADMIN/STAFF only)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<Void> updateOrderStatus(@PathVariable String id, 
                                              @RequestParam OrderStatus status) {
        return ApiResponse.<Void>builder()
                .message(orderService.updateOrderStatus(id, status))
                .build();
    }

    /**
     * Cancel order
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<Void> cancelOrder(@PathVariable String id) {
        return ApiResponse.<Void>builder()
                .message(orderService.cancelOrder(id))
                .build();
    }
}
