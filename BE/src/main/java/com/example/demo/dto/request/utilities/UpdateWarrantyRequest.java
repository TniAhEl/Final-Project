package com.example.demo.dto.request.utilities;

import lombok.Data;

@Data
public class UpdateWarrantyRequest {
    private String name;
    private int duration;
    private String condition;
    private String exception;
    private String note;
}
