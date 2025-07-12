package com.tri.revision.orchild.service.implement;

import com.tri.revision.orchild.entity.User;
import com.tri.revision.orchild.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    private final String issuer;
    private final long expirationTimeInMs;
    private final SecretKey secretKey;
    private final JwtEncoder jwtEncoder;
    private final BearerTokenResolver bearerTokenResolver;

    public JwtServiceImpl(
            @Value("${app.jwt.issuer:trideptrai}") String issuer,
            @Value("${app.jwt.expiration_in_hour:5}") int expirationTimeInHour,
            @Value("${app.jwt.secret_key}") String secretKeyInString,
            SecretKey secretKey,
            JwtEncoder jwtEncoder,
            BearerTokenResolver bearerTokenResolver) {

        this.issuer = issuer;
        this.expirationTimeInMs = TimeUnit.HOURS.toMillis(expirationTimeInHour);
        this.secretKey = secretKey;
        this.jwtEncoder = jwtEncoder;
        this.bearerTokenResolver = bearerTokenResolver;
    }

    @Override
    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiredTime = now.plusMillis(expirationTimeInMs);
        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();
        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .issuer(issuer)
                .subject(user.getUsername())
                .issuedAt(now)
                .claim("scp", user.getRole())
                .expiresAt(expiredTime)
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claimsSet)).getTokenValue();
    }

    @Override
    public String extractTokenFromRequest(HttpServletRequest request) {
        return bearerTokenResolver.resolve(request);
    }

    @Override
    public Jwt getJwtObjectFromJwtString(String jwtString) {
        NimbusJwtDecoder nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        return nimbusJwtDecoder.decode(jwtString);
    }

}