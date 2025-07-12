package com.tri.revision.orchild.mapper;

import com.tri.revision.orchild.dto.request.OrchidCreationRequest;
import com.tri.revision.orchild.dto.request.OrchidUpdateRequest;
import com.tri.revision.orchild.dto.response.OrchidResponse;
import com.tri.revision.orchild.entity.Orchid;
import com.tri.revision.orchild.entity.User;
import org.springframework.stereotype.Component;

@Component
public class OrchidMapper {

    /**
     * Convert OrchidCreationRequest to Orchid entity
     */
    public Orchid toOrchid(OrchidCreationRequest request, User createdBy) {
        if (request == null) {
            return null;
        }
        
        return Orchid.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .origin(request.origin())
                .color(request.color())
                .size(request.size())
                .isNatural(request.isNatural() != null ? request.isNatural() : false)
                .isAvailable(request.isAvailable() != null ? request.isAvailable() : true)
                .createdBy(createdBy)
                .build();
    }

    /**
     * Convert Orchid entity to OrchidResponse
     */
    public OrchidResponse toOrchidResponse(Orchid orchid) {
        if (orchid == null) {
            return null;
        }
        
        return new OrchidResponse(
                orchid.getId(),
                orchid.getName(),
                orchid.getDescription(),
                orchid.getPrice(),
                orchid.getStock(),
                orchid.getImageUrl(),
                orchid.getOrigin(),
                orchid.getColor(),
                orchid.getSize(),
                orchid.isNatural(),
                orchid.isAvailable(),
                orchid.getCreateAt(),
                orchid.getUpdateAt(),
                orchid.getCreatedBy() != null ? orchid.getCreatedBy().getUsername() : null
        );
    }

    /**
     * Update existing Orchid entity with OrchidUpdateRequest data
     */
    public void updateOrchidFromRequest(OrchidUpdateRequest request, Orchid orchid) {
        if (request == null || orchid == null) {
            return;
        }
        
        if (request.name() != null) {
            orchid.setName(request.name());
        }
        if (request.description() != null) {
            orchid.setDescription(request.description());
        }
        if (request.price() != null) {
            orchid.setPrice(request.price());
        }
        if (request.stock() != null) {
            orchid.setStock(request.stock());
        }
        if (request.imageUrl() != null) {
            orchid.setImageUrl(request.imageUrl());
        }
        if (request.origin() != null) {
            orchid.setOrigin(request.origin());
        }
        if (request.color() != null) {
            orchid.setColor(request.color());
        }
        if (request.size() != null) {
            orchid.setSize(request.size());
        }
        if (request.isNatural() != null) {
            orchid.setNatural(request.isNatural());
        }
        if (request.isAvailable() != null) {
            orchid.setAvailable(request.isAvailable());
        }
    }
}
