package com.tri.revision.orchild.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.tri.revision.orchild.repository.ExpiredTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    private final ExpiredTokenRepository expiredTokenRepository;

    @Value("${app.jwt.secret_key}")
    private String secretKeyString;

    @Bean
    SecretKey secretKey(){
        byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);
        return new SecretKeySpec(decodedKey, 0, decodedKey.length, JwsAlgorithms.HS256);
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey secretKey){
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey));
    }

    @Bean
    JwtDecoder jwtDecoderUsingAtFilterLayer(SecretKey secretKey){
        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(token -> {
            String jwtTokenId = token.getId();
            if(expiredTokenRepository.existsById(jwtTokenId))
                return OAuth2TokenValidatorResult.failure(new OAuth2Error("401"));
            return OAuth2TokenValidatorResult.success();
        });
        return decoder;

    }

    @Bean
    BearerTokenResolver bearerTokenResolver(){
        return new DefaultBearerTokenResolver();
    }
}
