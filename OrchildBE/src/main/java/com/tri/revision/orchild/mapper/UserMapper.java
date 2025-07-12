package com.tri.revision.orchild.mapper;

import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.dto.response.UserResponse;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Convert UserCreationRequest to User entity
     */
    public User toUser(UserCreationRequest request) {
        if (request == null) {
            return null;
        }
        
        return User.builder()
                .username(request.username())
                .password(request.password())
                .role(Role.USER) // Default role for new users
                .isActive(true) // Default active status
                .build();
    }

    /**
     * Convert User entity to UserResponse
     */
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.isActive(),
                user.getCreateAt(),
                user.getUpdateAt()
        );
    }

    /**
     * Update existing User entity with UserCreationRequest data
     */
    public void updateUserFromRequest(UserCreationRequest request, User user) {
        if (request == null || user == null) {
            return;
        }
        
        if (request.username() != null) {
            user.setUsername(request.username());
        }
        if (request.password() != null) {
            user.setPassword(request.password());
        }
    }

    /**
     * Convert User entity to UserResponse with custom role
     */
    public UserResponse toUserResponseWithRole(User user, Role role) {
        if (user == null) {
            return null;
        }
        
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                role,
                user.isActive(),
                user.getCreateAt(),
                user.getUpdateAt()
        );
    }
}