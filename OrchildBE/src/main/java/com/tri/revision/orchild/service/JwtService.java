package com.tri.revision.orchild.service;

import com.tri.revision.orchild.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface JwtService {
    String generateToken(User user);

    String extractTokenFromRequest(HttpServletRequest request);

    Jwt getJwtObjectFromJwtString(String jwtString);

}
