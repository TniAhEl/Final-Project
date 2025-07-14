package com.example.demo.dto.response.utility;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WarrantyResponse {
    private Long id;
    private int duration;
    private String condition;
    private String exception;
    private String note;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
