package com.tri.revision.orchild.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrderCreationRequest(
        @NotEmpty(message = "Order items are required")
        @Valid
        List<OrderItemRequest> items,

        @NotBlank(message = "Shipping address is required")
        @Size(max = 500, message = "Shipping address must not exceed 500 characters")
        String shippingAddress,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
        String phoneNumber,

        @Size(max = 500, message = "Notes must not exceed 500 characters")
        String notes
) {
}
