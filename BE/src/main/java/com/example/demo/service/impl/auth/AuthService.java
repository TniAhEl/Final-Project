package com.example.demo.service.impl.auth;

import com.example.demo.dto.request.AdminRegistrationRequest;
import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.UserRegistrationRequest;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.auth.User;
import com.example.demo.model.product.Cart;
import com.example.demo.repository.auth.AdminRepository;
import com.example.demo.repository.auth.UserRepository;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.service.impl.product.ICartService;
import com.example.demo.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // User Registration
    public AuthResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) ||
                adminRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail()) ||
                adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        User saveUser = userRepository.save(user);

        Cart cart = new Cart();
        cart.setUpdateAt(LocalDateTime.now());
        cart.setUser(saveUser);
        cartRepository.save(cart);


        String token = jwtUtil.generateToken(saveUser.getUsername(), "USER", saveUser.getId());
        return new AuthResponse(token, "USER", "User registered successfully");
    }

    // Admin Registration (typically done by super admin)
    public AuthResponse registerAdmin(AdminRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()) ||
                adminRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail()) ||
                adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setAdminRole(request.getAdminRole());

        Admin savedAdmin = adminRepository.save(admin);

        String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN", savedAdmin.getId());
        return new AuthResponse(token, "ADMIN", "Admin registered successfully");
    }

    // Login for both User and Admin
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Check if user exists in admin table
            Optional<Admin> admin = adminRepository.findByUsername(request.getUsername());
            if (admin.isPresent()) {
                String token = jwtUtil.generateToken(admin.get().getUsername(), "ADMIN", admin.get().getId());
                return new AuthResponse(token, "ADMIN", "Admin login successful");
            }

            // Check if user exists in user table
            Optional<User> user = userRepository.findByUsername(request.getUsername());
            if (user.isPresent()) {
                String token = jwtUtil.generateToken(user.get().getUsername() , "USER", user.get().getId());
                return new AuthResponse(token, "USER", "User login successful");
            }

            throw new RuntimeException("User not found");

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
