package com.example.demo.controller;

import com.example.demo.service.utility.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/mail")
public class MailController {

    private final MailService mailService;
    @GetMapping("/test-email")
    public ResponseEntity<?> sendTest() {
        mailService.sendTestEmail();
        return ResponseEntity.ok("Email sent!");
    }


}
