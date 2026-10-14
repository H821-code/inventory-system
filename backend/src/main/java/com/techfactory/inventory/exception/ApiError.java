package com.techfactory.inventory.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        int status,
        String message,
        Map<String, String> errors,
        LocalDateTime timestamp
) {
    public static ApiError of(int status, String message) {
        return new ApiError(status, message, Map.of(), LocalDateTime.now());
    }

    public static ApiError of(int status, String message, Map<String, String> errors) {
        return new ApiError(status, message, errors, LocalDateTime.now());
    }
}