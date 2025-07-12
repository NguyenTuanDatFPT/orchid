package com.tri.revision.orchild.dto.response;

import com.tri.revision.orchild.enums.Role;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String username,
        String email,
        String firstName,
        String lastName,
        Role role,
        boolean isActive,
        LocalDateTime createAt,
        LocalDateTime updateAt
) {}