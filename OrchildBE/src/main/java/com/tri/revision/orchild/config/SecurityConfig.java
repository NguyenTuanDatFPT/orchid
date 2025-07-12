package com.tri.revision.orchild.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.enums.Error;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.io.IOException;
import java.util.Objects;

@Configuration
@EnableWebSecurity(debug = true)
@RequiredArgsConstructor
@Slf4j
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] PUBLIC_ENTRY_POINT = {
        "api/auth/token", 
        "api/auth/refresh-token", 
        "api/user",
        "api/orchids/**", // Allow public access to orchid endpoints
        "api/orchids/{id}" // Allow public access to specific orchid
    };
    private final JwtDecoder decoder;
    private final ObjectMapper objectMapper;
    private final CorsConfigurationSource corsConfigurationSource;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                            CorsConfiguration config = new CorsConfiguration();
                            config.setAllowCredentials(true);
                            config.addAllowedOriginPattern("*");
                            config.addAllowedHeader("*");
                            config.addAllowedMethod("*");
                            config.setMaxAge(3600L);
                            return config;
                        }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENTRY_POINT).permitAll()
                        .requestMatchers(HttpMethod.GET, "api/orchids", "api/orchids/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/user").permitAll()
                        .requestMatchers(HttpMethod.POST, "api/auth/logout").authenticated()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(auth -> auth.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(decoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new AuthEntryPointCustomize(objectMapper))
                )
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

        return authenticationConverter;

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    @RequiredArgsConstructor
    private static class AuthEntryPointCustomize implements AuthenticationEntryPoint {

        private final ObjectMapper objectMapper;

        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
                throws IOException, ServletException {

            log.error("Authentication error: {} || class: {}",
                    authException.getMessage(),
                    authException.getClass().getName());

            //bắn đi phải định nghĩa kiểu dữ liệu
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            Error errorToReport = getError(authException);

            response.setStatus(errorToReport.getStatus().value());
            ApiResponse<?> apiResponse = ApiResponse.builder()
                    .code(errorToReport.getStatus().value())
                    .message(errorToReport.getMessage())
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        }

        private Error getError(AuthenticationException authException) {
            Error errorToReport;
            if (authException instanceof InvalidBearerTokenException){
                String message = authException.getCause().getMessage();
                if(Objects.nonNull(message) && message.toLowerCase().contains("expired")){
                    errorToReport = Error.EXPIRED_TOKEN;
                }else {
                    //chừa phần cho những lỗi sau. sai key...
                    errorToReport = Error.UNAUTHENTICATED;
                }
            }else{
                errorToReport = Error.UNAUTHENTICATED;
            }
            return errorToReport;
        }
    }

}



