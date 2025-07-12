package com.tri.revision.orchild.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrchidCreationRequest(
        @NotBlank(message = "Orchid name is required")
        @Size(max = 100, message = "Orchid name must not exceed 100 characters")
        String name,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        @Digits(integer = 8, fraction = 2, message = "Price format is invalid")
        BigDecimal price,

        @NotNull(message = "Stock is required")
        @Min(value = 0, message = "Stock must be 0 or positive")
        Integer stock,

        String imageUrl,

        @Size(max = 50, message = "Origin must not exceed 50 characters")
        String origin,

        @Size(max = 50, message = "Color must not exceed 50 characters")
        String color,

        @Size(max = 50, message = "Size must not exceed 50 characters")
        String size,

        Boolean isNatural,

        Boolean isAvailable
) {
}
