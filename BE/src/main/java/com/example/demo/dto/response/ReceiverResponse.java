package com.example.demo.dto.response;

import lombok.Data;

@Data
public class ReceiverResponse {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;

}
