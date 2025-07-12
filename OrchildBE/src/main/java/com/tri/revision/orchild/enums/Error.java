package com.tri.revision.orchild.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum Error {
    USERNAME_EXIST("Username existed, please choose another!", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("User not found!", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD("Invalid password!", HttpStatus.BAD_REQUEST),
    JWT_ERROR("Something wrong with JWT token. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR ),
    UNAUTHENTICATED("Account is not authenticated. Please try again", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN("The token is expired.", HttpStatus.UNAUTHORIZED),
    OVERDUE_REFRESH_TIME("The refresh duration is overdue.", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN( "Refresh token is missing the 'issued at' claim.", HttpStatus.BAD_REQUEST ),
    ACCESS_DENIED("Your account do not have permission to access this feature.", HttpStatus.FORBIDDEN),
    INVALID_ROLE("Invalid role provided.", HttpStatus.BAD_REQUEST)
    ;


    private String message;
    private HttpStatus status;
}
