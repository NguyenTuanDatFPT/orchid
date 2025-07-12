package com.tri.revision.orchild.service;

import com.tri.revision.orchild.dto.response.AuthResponse;
import com.tri.revision.orchild.dto.request.RefreshTokenRequest;
import com.tri.revision.orchild.dto.request.UserCreationRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface AuthService {
    public AuthResponse getToken(UserCreationRequest userDto);

    String handleLogout(HttpServletRequest request);

    AuthResponse getRefreshToken(@Valid RefreshTokenRequest request);
}
