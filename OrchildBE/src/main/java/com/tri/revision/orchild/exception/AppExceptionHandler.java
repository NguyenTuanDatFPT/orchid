package com.tri.revision.orchild.exception;

import com.tri.revision.orchild.dto.response.ApiResponse;
import com.tri.revision.orchild.enums.Error;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

@RestControllerAdvice
@Slf4j
public class AppExceptionHandler {

    @ExceptionHandler(Exception.class)
    private ResponseEntity<ApiResponse> internalServerExceptionHandler(Exception exception){
        log.error("Internal Exception: class {} || cause {} || message {} || strace {}",
                exception.getClass(),
                exception.getCause(),
                exception.getMessage(),
                getFirstElementOfStackTrace(exception));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.builder()
                        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Some trouble in server")
                        .build());
    }

    @ExceptionHandler(AppException.class)
    private ResponseEntity<ApiResponse> appExceptionHandler(AppException exception){
        Error error = exception.getError();
        log.error("🔨 Application exception {} || strace {}",
                exception.getMessage(),
                getFirstElementOfStackTrace(exception));

        return ResponseEntity
                .status(error.getStatus())
                .body(ApiResponse.builder()
                        .code(error.getStatus().value())
                        .message(error.getMessage())
                        .build());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    private ResponseEntity<ApiResponse> authorizationDeniedExceptionHandler(AuthorizationDeniedException exception){
        log.error("Authorization denied exception: {}", exception.getMessage());
        Error error = Error.ACCESS_DENIED;

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.builder()
                        .code(error.getStatus().value())
                        .message(error.getMessage())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    private ResponseEntity<ApiResponse> methodArgumentExceptionHandler(MethodArgumentNotValidException exception){
        log.error("Invalid method argument exception: {}", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .message(exception.getFieldError().getDefaultMessage())
                        .build());
    }

    private String getFirstElementOfStackTrace(Exception e){
        StackTraceElement[] elements = e.getStackTrace();
        Object firstElement = elements[0];
        return Objects.nonNull(firstElement) ? firstElement.toString() : "";
    }

}
