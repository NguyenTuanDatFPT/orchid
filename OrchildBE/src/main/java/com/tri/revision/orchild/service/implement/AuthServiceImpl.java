package com.tri.revision.orchild.service.implement;

import com.tri.revision.orchild.dto.response.AuthResponse;
import com.tri.revision.orchild.dto.request.RefreshTokenRequest;
import com.tri.revision.orchild.dto.request.UserCreationRequest;
import com.tri.revision.orchild.entity.ExpiredToken;
import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.enums.Error;
import com.tri.revision.orchild.exception.AppException;
import com.tri.revision.orchild.repository.ExpiredTokenRepository;
import com.tri.revision.orchild.service.AuthService;
import com.tri.revision.orchild.service.JwtService;
import com.tri.revision.orchild.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ExpiredTokenRepository expiredTokenRepository;
    @Value("${app.jwt.refresh_expiration_in_day:20}")
    private int refreshableDurationInDay;

    @Override
    public AuthResponse getToken(UserCreationRequest userDto) {
        User user = userService.getUserByUsername(userDto.username());
        if(!passwordEncoder.matches(userDto.password(), user.getPassword()))
            throw new AppException(Error.INVALID_PASSWORD);

        return AuthResponse.builder()
                .isAuthenticate(true)
                .jwtToken(jwtService.generateToken(user))
                .role(user.getRole().toString())
                .build();

    }

    @Override
    public String handleLogout(HttpServletRequest request){
        String message;
        String token = jwtService.extractTokenFromRequest(request);
        if(Strings.isNotBlank(token)){
            Jwt jwtToken = jwtService.getJwtObjectFromJwtString(token);
            persistExpiredToken(jwtToken.getId());
            message = "Logout successfully";
        }else {
            message = "Logout request acknowledged. No active session token found to invalidate on server.";
        }
        return message;
    }

    private void persistExpiredToken(String jwtId){
        expiredTokenRepository.save(ExpiredToken.builder()
                .id(jwtId)
                .expiredAt(Instant.now())
                .build());
    }

    @Override
    public AuthResponse getRefreshToken(RefreshTokenRequest request) {
        Jwt jwtToken = jwtService.getJwtObjectFromJwtString(request.token());
        User user = userService.getUserByUsername(jwtToken.getSubject());
        Instant issuedAt = jwtToken.getIssuedAt();
        if (issuedAt == null) {
            throw new AppException(Error.INVALID_TOKEN);
        }

        if(isRefreshAllowed(jwtToken.getIssuedAt())){
            persistExpiredToken(jwtToken.getId());
            return AuthResponse.builder()
                    .role(user.getRole().toString())
                    .jwtToken(jwtService.generateToken(user))
                    .isAuthenticate(true)
                    .build();
        }else {
            throw new AppException(Error.OVERDUE_REFRESH_TIME);
        }
    }

    private boolean isRefreshAllowed(Instant issuedAt){
        Instant refreshDeadline = issuedAt.plus(refreshableDurationInDay, ChronoUnit.DAYS);
        return Instant.now().isBefore(refreshDeadline);
    }



}
