package com.example.demo.service.impl.auth;

import org.springframework.security.core.userdetails.UserDetails;

public interface CustomerService {
    UserDetails loadUserByUsername(String username);
}
