package com.example.demo.dto.response.order;

import com.example.demo.enums.TransportStatus;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderTransportResponse {
    private TransportStatus ship;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private String trackingNumber;
}
