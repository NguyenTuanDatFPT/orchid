package com.tri.revision.orchild.service;

import com.tri.revision.orchild.dto.request.OrderCreationRequest;
import com.tri.revision.orchild.dto.request.OrderItemRequest;
import com.tri.revision.orchild.dto.response.OrderResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.entity.Order;
import com.tri.revision.orchild.entity.OrderItem;
import com.tri.revision.orchild.entity.Orchid;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.OrderStatus;
import com.tri.revision.orchild.exception.AppException;
import com.tri.revision.orchild.exception.ResourceNotFoundException;
import com.tri.revision.orchild.mapper.OrderMapper;
import com.tri.revision.orchild.repository.OrderRepository;
import com.tri.revision.orchild.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final OrchidService orchidService;
    private final UserService userService;
    private final PageService pageService;

    /**
     * Create new order
     */
    public String createOrder(OrderCreationRequest request) {
        User currentUser = userService.getCurrentUser();
        
        // Calculate total amount and validate orchids
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (OrderItemRequest itemRequest : request.items()) {
            Orchid orchid = orchidService.getOrchidEntityById(itemRequest.orchidId());
            
            // Check if orchid is available and has enough stock
            if (!orchid.isAvailable()) {
                throw new AppException(null); // Add appropriate error
            }
            
            if (orchid.getStock() < itemRequest.quantity()) {
                throw new AppException(null); // Add appropriate error
            }
            
            BigDecimal itemTotal = orchid.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        // Create order
        Order order = orderMapper.toOrder(request, currentUser, totalAmount);
        Order savedOrder = orderRepository.save(order);
        
        // Create order items and update stock
        for (OrderItemRequest itemRequest : request.items()) {
            Orchid orchid = orchidService.getOrchidEntityById(itemRequest.orchidId());
            
            // Update stock
            orchid.setStock(orchid.getStock() - itemRequest.quantity());
            
            // Create order item
            OrderItem orderItem = orderMapper.toOrderItem(itemRequest, savedOrder, orchid);
            orderItems.add(orderItem);
        }
        
        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);
        
        return "Order created successfully with ID: " + savedOrder.getId();
    }

    /**
     * Get all orders with pagination (ADMIN/STAFF only)
     */
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getAllOrders(Integer page, Integer size, String sortBy, String sortDirection,
                                                   String userId, OrderStatus status) {
        Pageable pageable = pageService.createPageable(page, size, sortBy, sortDirection);
        
        Page<Order> orderPage = orderRepository.findWithFilters(userId, status, pageable);
        Page<OrderResponse> responsePage = orderPage.map(orderMapper::toOrderResponse);
        
        return PageResponse.of(responsePage);
    }

    /**
     * Get my orders
     */
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(Integer page, Integer size, String sortBy, String sortDirection) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = pageService.createPageable(page, size, sortBy, sortDirection);
        
        Page<Order> orderPage = orderRepository.findByUserId(currentUser.getId(), pageable);
        Page<OrderResponse> responsePage = orderPage.map(orderMapper::toOrderResponse);
        
        return PageResponse.of(responsePage);
    }

    /**
     * Get order by ID
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        // Check if current user can access this order
        User currentUser = userService.getCurrentUser();
        if (!order.getUser().getId().equals(currentUser.getId()) && 
            !isAdminOrStaff(currentUser)) {
            throw new AppException(null); // Add appropriate error
        }
        
        return orderMapper.toOrderResponse(order);
    }

    /**
     * Update order status (ADMIN/STAFF only)
     */
    public String updateOrderStatus(String id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        order.setStatus(status);
        orderRepository.save(order);
        
        return "Order status updated successfully";
    }

    /**
     * Cancel order
     */
    public String cancelOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        User currentUser = userService.getCurrentUser();
        
        // Check permissions
        if (!order.getUser().getId().equals(currentUser.getId()) && 
            !isAdminOrStaff(currentUser)) {
            throw new AppException(null); // Add appropriate error
        }
        
        // Only allow cancellation for pending/confirmed orders
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(null); // Add appropriate error
        }
        
        // Restore stock
        for (OrderItem orderItem : order.getOrderItems()) {
            Orchid orchid = orderItem.getOrchid();
            orchid.setStock(orchid.getStock() + orderItem.getQuantity());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        return "Order cancelled successfully";
    }

    private boolean isAdminOrStaff(User user) {
        return user.getRole().name().equals("ADMIN") || user.getRole().name().equals("STAFF");
    }
}
