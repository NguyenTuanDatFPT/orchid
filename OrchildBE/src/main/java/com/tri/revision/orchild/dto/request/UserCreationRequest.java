package com.tri.revision.orchild.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserCreationRequest(
        @Size(min = 5, max = 20, message = "username must between 5 and 20 characters")
        String username,
        @Size(min = 5, max = 30, message = "password must between 5 and 30 characters")
        String password
) {
}
