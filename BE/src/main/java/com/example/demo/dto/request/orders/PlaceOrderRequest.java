package com.example.demo.dto.request.orders;

import com.example.demo.dto.request.ListProductOrderRequest;
import com.example.demo.dto.request.utilities.InsurancePendingRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import lombok.Data;

import java.util.List;
@Data
public class PlaceOrderRequest {
    private OrderInforRequest orderInfo;
    private List<InsurancePendingRequest> insuranceContracts;
    private ListProductOrderRequest productList;
}
