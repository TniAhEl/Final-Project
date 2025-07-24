package com.example.demo.service.impl.auth;

import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.auth.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface CustomerService {
    UserDetails loadUserByUsername(String username);
}
