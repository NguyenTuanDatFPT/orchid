package com.tri.revision.orchild.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record RefreshTokenRequest(@NotBlank String token) {
}
