package com.tri.revision.orchild.exception;

import com.tri.revision.orchild.enums.Error;
import lombok.Getter;

@Getter
public class AppException extends RuntimeException{
    private final Error error;
    private final String messageDetail;

    public AppException(Error error, String messageDetail) {
        super(error.getMessage());
        this.error = error;
        this.messageDetail = messageDetail;
    }

    public AppException (Error error){
        this(error, null);
    }
}
