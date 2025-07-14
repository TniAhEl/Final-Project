package com.example.demo.exception;

public class OutOfRemainingResourceException extends RuntimeException {
    public OutOfRemainingResourceException(String message) {
        super(message);
    }
}
