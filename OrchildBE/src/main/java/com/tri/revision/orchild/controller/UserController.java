package com.tri.revision.orchild.controller;

import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.dto.response.UserResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ApiResponse<Void> createAccount(@Valid @RequestBody UserCreationRequest userDto){
        return ApiResponse.<Void>builder()
                .message(userService.createUser(userDto))
                .build();
    }

    @GetMapping("myinfor")
    public ApiResponse<UserResponse> getUserInfor(){
        return ApiResponse.<UserResponse>builder()
                .payload(userService.getMyInfor())
                .build();
    }

    /**
     * Get all users with pagination (ADMIN only)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role) {
        
        PageResponse<UserResponse> users = userService.getAllUsers(
                page, size, sortBy, sortDirection, username, role);
        
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .payload(users)
                .build();
    }

    /**
     * Update user role (ADMIN only)
     */
    @PutMapping("/admin/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> updateUserRole(
            @PathVariable String userId,
            @RequestParam String role) {
        
        return ApiResponse.<Void>builder()
                .message(userService.updateUserRole(userId, role))
                .build();
    }

    /**
     * Deactivate user (ADMIN only)
     */
    @PutMapping("/admin/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivateUser(@PathVariable String userId) {
        return ApiResponse.<Void>builder()
                .message(userService.deactivateUser(userId))
                .build();
    }

    /**
     * Reactivate user (ADMIN only)
     */
    @PutMapping("/admin/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> activateUser(@PathVariable String userId) {
        return ApiResponse.<Void>builder()
                .message(userService.activateUser(userId))
                .build();
    }

}
