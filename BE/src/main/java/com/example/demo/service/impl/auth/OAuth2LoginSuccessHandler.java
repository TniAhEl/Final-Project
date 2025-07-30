package com.example.demo.service.impl.auth;

import com.example.demo.security.JwtTokenProvider;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Bạn có thể gán mặc định nếu chưa lưu user trong DB
        String role = "ROLE_USER";
        Long userId = 0L; // nếu chưa lấy được ID thực, tạm dùng 0L hoặc tìm trong DB

        // Sinh token
        String token = jwtUtil.generateToken(email, role, userId);

        // Redirect với token
        response.sendRedirect("http://localhost:3000/oauth2/success?token=" + token);
    }
}


