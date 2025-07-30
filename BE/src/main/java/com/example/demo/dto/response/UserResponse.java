package com.example.demo.dto.response;

import com.example.demo.enums.CustomerStatus;
import com.example.demo.model.auth.User;
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
    private String status;

    public UserResponse(String firstName, String lastName, LocalDate bday,
                        String address, String email, String phone, String status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.bday = bday;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.status = status;
    }
    public UserResponse(){

    }
}
