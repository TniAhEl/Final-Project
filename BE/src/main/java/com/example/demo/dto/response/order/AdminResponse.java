package com.example.demo.dto.response.order;

import com.example.demo.enums.AdminRole;
import lombok.Data;

@Data
public class AdminResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private AdminRole adminRole;
}
