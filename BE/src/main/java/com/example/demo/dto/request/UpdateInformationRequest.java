package com.example.demo.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateInformationRequest {
    private String firstName;
    private String lastName;
    private LocalDate bday;
    private String address;
    private String phone;
}
