package com.example.demo.dto.request;

import lombok.Data;

@Data
public class ReceiverInfoRequest {
    private String name;
    private String address;
    private String phone;
    private String email;
}
