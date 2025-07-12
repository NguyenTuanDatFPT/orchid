package com.tri.revision.orchild.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(boolean isAuthenticate, String jwtToken, String role) {
}
