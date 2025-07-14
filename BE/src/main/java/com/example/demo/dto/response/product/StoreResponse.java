package com.example.demo.dto.response.product;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StoreResponse {
    private Long id;
    private String name;
    private String location;
    private LocalDateTime updateAt;
}
