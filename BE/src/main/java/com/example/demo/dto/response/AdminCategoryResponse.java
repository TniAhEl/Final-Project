package com.example.demo.dto.response;

import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Data
public class AdminCategoryResponse {
    private Long id;
    private String name;
    private LocalDateTime updateAt;
    private LocalDateTime createAt;
}
