package com.example.demo.dto.request.utilities;

import lombok.Data;

@Data
public class OrderInforRequest {
    private String address;
    private String note;
    private String type;
}
