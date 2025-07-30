package com.example.demo.controller.auth;

import com.example.demo.dto.request.*;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.ReceiverResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.model.UserMonthlyReports;
import com.example.demo.model.auth.User;
import com.example.demo.service.impl.auth.AuthService;
import com.example.demo.service.impl.auth.UserReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    private User user;
    @Autowired
    private UserReportsService userReportsService;



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

    @PostMapping("/admin/get/user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserInfor( @RequestBody UserFilter filter, @RequestParam int page, @RequestParam int size){
        return ResponseEntity.ok(authService.AdminGetUser(filter,page,size));
    }

    @PostMapping("/customer/reports/summary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserMonthlyReports> summaryReports(@RequestParam Long userId){
        return ResponseEntity.ok(userReportsService.summaryReport(userId));
    }

    @PostMapping("/customer/reports/filter")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> filterReports(@RequestBody MonthlyReportsFilter filter,@RequestParam Long userId,@RequestParam int page, @RequestParam int size){
        return ResponseEntity.ok(userReportsService.FilterMonthlyReport(filter, userId, page, size));
    }

    @PostMapping("/admin/reports/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserMonthlyReports> adminSummaryReports(){
        return ResponseEntity.ok(userReportsService.AdminSummaryReport());
    }

    @PostMapping("/admin/reports/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminFilterReport(@RequestBody MonthlyReportsFilter filter,@RequestParam int page, @RequestParam int size){
        return ResponseEntity.ok(userReportsService.adminFilterMonthlyReport(filter, page, size));
    }

    @PostMapping("/customer/add/receiver")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReceiverResponse> customerAddReceiver(@RequestBody ReceiverInfoRequest request, @RequestParam Long userId){
        return ResponseEntity.ok(authService.createReceiver(request, userId));

    }

    @PostMapping("/customer/update/receiver")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReceiverResponse> customerUpdateReceiver(@RequestBody ReceiverInfoRequest request, @RequestParam Long receiverId){
        return ResponseEntity.ok(authService.updateReceiver(request, receiverId));

    }

    @GetMapping("/customer/{userId}/receiver")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ReceiverResponse>> getListReceiver(@PathVariable Long userId){
        return ResponseEntity.ok(authService.getListReceiver(userId));
    }
}
