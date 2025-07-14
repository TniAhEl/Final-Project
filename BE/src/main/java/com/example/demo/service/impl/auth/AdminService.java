package com.example.demo.service.impl.auth;

import org.springframework.security.core.userdetails.UserDetails;

public interface AdminService {
    UserDetails loadUserByUsername(String username);
}
