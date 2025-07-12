package com.tri.revision.orchild.service;


import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.dto.response.UserResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.entity.User;

public interface UserService {
    UserResponse getMyInfor();

    String createUser(UserCreationRequest userDto);

    User getUserByUsername(String username);
    
    User getCurrentUser();
    
    PageResponse<UserResponse> getAllUsers(Integer page, Integer size, String sortBy, String sortDirection,
                                          String username, String role);
    
    String updateUserRole(String userId, String role);
    
    String deactivateUser(String userId);
    
    String activateUser(String userId);

}
