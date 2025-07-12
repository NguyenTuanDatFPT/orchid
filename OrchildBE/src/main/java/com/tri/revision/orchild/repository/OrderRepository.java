package com.tri.revision.orchild.repository;

import com.tri.revision.orchild.entity.Order;
import com.tri.revision.orchild.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    Page<Order> findByUserId(String userId, Pageable pageable);
    
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(:userId IS NULL OR o.user.id = :userId) AND " +
           "(:status IS NULL OR o.status = :status)")
    Page<Order> findWithFilters(@Param("userId") String userId,
                               @Param("status") OrderStatus status,
                               Pageable pageable);
}
