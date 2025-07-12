package com.tri.revision.orchild.service;

import com.tri.revision.orchild.dto.request.OrchidCreationRequest;
import com.tri.revision.orchild.dto.request.OrchidUpdateRequest;
import com.tri.revision.orchild.dto.response.OrchidResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.entity.Orchid;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.exception.ResourceNotFoundException;
import com.tri.revision.orchild.mapper.OrchidMapper;
import com.tri.revision.orchild.repository.OrchidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class OrchidService {
    
    private final OrchidRepository orchidRepository;
    private final OrchidMapper orchidMapper;
    private final UserService userService;
    private final PageService pageService;

    /**
     * Create new orchid (ADMIN/STAFF only)
     */
    public String createOrchid(OrchidCreationRequest request) {
        User currentUser = userService.getCurrentUser();
        
        Orchid orchid = orchidMapper.toOrchid(request, currentUser);
        Orchid savedOrchid = orchidRepository.save(orchid);
        
        return "Orchid created successfully with ID: " + savedOrchid.getId();
    }

    /**
     * Get all orchids with pagination and filters
     */
    @Transactional(readOnly = true)
    public PageResponse<OrchidResponse> getAllOrchids(Integer page, Integer size, String sortBy, String sortDirection,
                                                     String name, Boolean isAvailable, Boolean isNatural,
                                                     BigDecimal minPrice, BigDecimal maxPrice) {
        Pageable pageable = pageService.createPageable(page, size, sortBy, sortDirection);
        
        Page<Orchid> orchidPage = orchidRepository.findWithFilters(
                name, isAvailable, isNatural, minPrice, maxPrice, pageable);
        
        Page<OrchidResponse> responsePagev = orchidPage.map(orchidMapper::toOrchidResponse);
        return PageResponse.of(responsePagev);
    }

    /**
     * Get available orchids for customers
     */
    @Transactional(readOnly = true)
    public PageResponse<OrchidResponse> getAvailableOrchids(Integer page, Integer size, String sortBy, String sortDirection,
                                                           String name, Boolean isNatural, BigDecimal minPrice, BigDecimal maxPrice) {
        Pageable pageable = pageService.createPageable(page, size, sortBy, sortDirection);
        
        Page<Orchid> orchidPage = orchidRepository.findWithFilters(
                name, true, isNatural, minPrice, maxPrice, pageable);
        
        Page<OrchidResponse> responsePage = orchidPage.map(orchidMapper::toOrchidResponse);
        return PageResponse.of(responsePage);
    }

    /**
     * Get orchid by ID
     */
    @Transactional(readOnly = true)
    public OrchidResponse getOrchidById(String id) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with ID: " + id));
        
        return orchidMapper.toOrchidResponse(orchid);
    }

    /**
     * Update orchid (ADMIN/STAFF only)
     */
    public String updateOrchid(String id, OrchidUpdateRequest request) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with ID: " + id));
        
        orchidMapper.updateOrchidFromRequest(request, orchid);
        orchidRepository.save(orchid);
        
        return "Orchid updated successfully";
    }

    /**
     * Delete orchid (ADMIN only)
     */
    public String deleteOrchid(String id) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with ID: " + id));
        
        orchidRepository.delete(orchid);
        return "Orchid deleted successfully";
    }

    /**
     * Get orchid entity by ID (for internal use)
     */
    @Transactional(readOnly = true)
    public Orchid getOrchidEntityById(String id) {
        return orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid not found with ID: " + id));
    }
}
