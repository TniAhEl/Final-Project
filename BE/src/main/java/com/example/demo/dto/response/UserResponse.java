package com.example.demo.dto.response;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {
    private String firstName;
    private String lastName;
    private LocalDate bday;
    private String address;
    private String email;
    private String phone;
}
