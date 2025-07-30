package com.example.demo.dto.request;

import com.example.demo.enums.CustomerStatus;
import lombok.Data;

@Data
public class UserFilter {
    private CustomerStatus status;
}
