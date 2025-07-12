package com.tri.revision.orchild.controller;

import com.tri.revision.orchild.dto.request.OrchidCreationRequest;
import com.tri.revision.orchild.dto.request.OrchidUpdateRequest;
import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.dto.response.OrchidResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.service.OrchidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("api/orchids")
@RequiredArgsConstructor
public class OrchidController {
    
    private final OrchidService orchidService;

    /**
     * Create new orchid (ADMIN/STAFF only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<Void> createOrchid(@Valid @RequestBody OrchidCreationRequest request) {
        return ApiResponse.<Void>builder()
                .message(orchidService.createOrchid(request))
                .build();
    }

    /**
     * Get all orchids with filters and pagination (ADMIN/STAFF only)
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<PageResponse<OrchidResponse>> getAllOrchids(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean isAvailable,
            @RequestParam(required = false) Boolean isNatural,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        PageResponse<OrchidResponse> orchids = orchidService.getAllOrchids(
                page, size, sortBy, sortDirection, name, isAvailable, isNatural, minPrice, maxPrice);
        
        return ApiResponse.<PageResponse<OrchidResponse>>builder()
                .payload(orchids)
                .build();
    }

    /**
     * Get available orchids for customers (PUBLIC)
     */
    @GetMapping
    public ApiResponse<PageResponse<OrchidResponse>> getAvailableOrchids(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean isNatural,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        PageResponse<OrchidResponse> orchids = orchidService.getAvailableOrchids(
                page, size, sortBy, sortDirection, name, isNatural, minPrice, maxPrice);
        
        return ApiResponse.<PageResponse<OrchidResponse>>builder()
                .payload(orchids)
                .build();
    }

    /**
     * Get orchid by ID (PUBLIC)
     */
    @GetMapping("/{id}")
    public ApiResponse<OrchidResponse> getOrchidById(@PathVariable String id) {
        return ApiResponse.<OrchidResponse>builder()
                .payload(orchidService.getOrchidById(id))
                .build();
    }

    /**
     * Update orchid (ADMIN/STAFF only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<Void> updateOrchid(@PathVariable String id, 
                                         @Valid @RequestBody OrchidUpdateRequest request) {
        return ApiResponse.<Void>builder()
                .message(orchidService.updateOrchid(id, request))
                .build();
    }

    /**
     * Delete orchid (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteOrchid(@PathVariable String id) {
        return ApiResponse.<Void>builder()
                .message(orchidService.deleteOrchid(id))
                .build();
    }
}
