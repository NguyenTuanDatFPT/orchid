package com.tri.revision.orchild.repository;

import com.tri.revision.orchild.entity.Orchid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, String> {
    
    Page<Orchid> findByIsAvailableTrue(Pageable pageable);
    
    Page<Orchid> findByNameContainingIgnoreCaseAndIsAvailableTrue(String name, Pageable pageable);
    
    Page<Orchid> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT o FROM Orchid o WHERE " +
           "(:name IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:isAvailable IS NULL OR o.isAvailable = :isAvailable) AND " +
           "(:isNatural IS NULL OR o.isNatural = :isNatural) AND " +
           "(:minPrice IS NULL OR o.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR o.price <= :maxPrice)")
    Page<Orchid> findWithFilters(@Param("name") String name,
                                @Param("isAvailable") Boolean isAvailable,
                                @Param("isNatural") Boolean isNatural,
                                @Param("minPrice") java.math.BigDecimal minPrice,
                                @Param("maxPrice") java.math.BigDecimal maxPrice,
                                Pageable pageable);
}
