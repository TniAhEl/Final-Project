package com.example.demo.controller.auth;

import com.example.demo.dto.request.AdminRegistrationRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.UpdateInformationRequest;
import com.example.demo.dto.request.UserRegistrationRequest;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.auth.User;
import com.example.demo.service.impl.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    private User user;

    @PostMapping("/register/user")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody UserRegistrationRequest request) {
        try {
            AuthResponse response = authService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, user.getId(), e.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@RequestBody AdminRegistrationRequest request) {
        try {
            AuthResponse response = authService.registerAdmin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, user.getId(), e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, user.getId(), e.getMessage()));
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> getProfile(Authentication authentication) {
        return ResponseEntity.ok("Profile for: " + authentication.getName());
    }

    @GetMapping("/information")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> getInformation(@RequestParam Long userId){
        UserResponse info= authService.getUserInfo(userId);
        return ResponseEntity.ok(info);
    }

    @PutMapping("/update/information")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> updateInformation(@RequestParam Long userId, @RequestBody UpdateInformationRequest request){
        UserResponse update = authService.updateInfomation(userId, request);
        return ResponseEntity.ok(update);
    }
}
