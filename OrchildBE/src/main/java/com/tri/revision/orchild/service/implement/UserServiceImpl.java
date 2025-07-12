package com.tri.revision.orchild.service.implement;

import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.dto.response.UserResponse;
import com.tri.revision.orchild.dto.response.PageResponse;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.Error;
import com.tri.revision.orchild.enums.Role;
import com.tri.revision.orchild.exception.AppException;
import com.tri.revision.orchild.mapper.UserMapper;
import com.tri.revision.orchild.repository.UserRepository;
import com.tri.revision.orchild.service.UserService;
import com.tri.revision.orchild.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PageService pageService;
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserResponse getMyInfor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal;
        String username = "";
        if(Objects.isNull(authentication) || !authentication.isAuthenticated()){
            throw new AppException(Error.UNAUTHENTICATED);
        }else{
            principal = authentication.getPrincipal();
        }
        if(Objects.nonNull(principal) && principal instanceof Jwt jwtPrincipal){
            username = jwtPrincipal.getSubject();
        }
        return userMapper.toUserResponse(getUserByUsername(username));


    }




    @Override
    public String createUser(UserCreationRequest userDto) {
        if(isUsernameExist(userDto.username()))
            throw new AppException(Error.USERNAME_EXIST);
        User user = User.builder()
                .username(userDto.username())
                .password(passwordEncoder.encode(userDto.password()))
                .role(Role.USER)
                .isActive(true)
                .build();
        userRepository.save(user);
        return "Create successfully";
    }

    private boolean isUsernameExist(String username){
        return userRepository.existsByUsername(username);
    }

    public User getUserByUsername(String username){
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new AppException(Error.USER_NOT_FOUND));
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (Objects.isNull(authentication) || !authentication.isAuthenticated()) {
            throw new AppException(Error.UNAUTHENTICATED);
        }
        
        Object principal = authentication.getPrincipal();
        String username = "";
        
        if (Objects.nonNull(principal) && principal instanceof Jwt jwtPrincipal) {
            username = jwtPrincipal.getSubject();
        }
        
        return getUserByUsername(username);
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(Integer page, Integer size, String sortBy, String sortDirection,
                                                 String username, String role) {
        Pageable pageable = pageService.createPageable(page, size, sortBy, sortDirection);
        
        Specification<User> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (username != null && !username.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("username")), 
                    "%" + username.toLowerCase() + "%"));
            }
            
            if (role != null && !role.trim().isEmpty()) {
                try {
                    Role roleEnum = Role.valueOf(role.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("role"), roleEnum));
                } catch (IllegalArgumentException e) {
                    // Invalid role, ignore filter
                }
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<User> userPage = userRepository.findAll(spec, pageable);
        Page<UserResponse> responsePage = userPage.map(userMapper::toUserResponse);
        
        return PageResponse.of(responsePage);
    }

    @Override
    public String updateUserRole(String userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(Error.USER_NOT_FOUND));
        
        try {
            Role newRole = Role.valueOf(role.toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
            return "User role updated successfully";
        } catch (IllegalArgumentException e) {
            throw new AppException(Error.INVALID_ROLE);
        }
    }

    @Override
    public String deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(Error.USER_NOT_FOUND));
        
        user.setActive(false);
        userRepository.save(user);
        return "User deactivated successfully";
    }

    @Override
    public String activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(Error.USER_NOT_FOUND));
        user.setActive(true);
        userRepository.save(user);
        return "User activated successfully";
    }
}
