package com.tri.revision.orchild.controller;

import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.dto.request.RefreshTokenRequest;
import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Login - Get access token (PUBLIC)
     */
    @PostMapping("/token")
    public ApiResponse<?> getToken(@Valid @RequestBody UserCreationRequest userDto){
        return ApiResponse.builder()
                .payload(authService.getToken(userDto))
                .build();
    }

    /**
     * Refresh token (PUBLIC)
     */
    @PostMapping("/refresh-token")
    public ApiResponse<?> getRefreshedToken(@Valid @RequestBody RefreshTokenRequest request){
        return ApiResponse.builder()
                .payload(authService.getRefreshToken(request))
                .build();
    }

    /**
     * Logout (Authenticated users only)
     */
    @PostMapping("/logout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('STAFF')")
    public ApiResponse<?> logout(HttpServletRequest request){
        return ApiResponse.builder()
                .message(authService.handleLogout(request))
                .build();
    }

}
