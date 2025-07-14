package com.example.demo.service.impl.order;

import com.example.demo.dto.request.orders.OrderFilterRequest;
import com.example.demo.dto.request.utilities.InsuranceContractRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import com.example.demo.dto.response.order.OrderResponse;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.order.Order;

import java.util.List;
import java.util.Map;

public interface IOrderService {

    Order placeOrder(Long userId, OrderInforRequest request, String promotionCode, List<InsuranceContractRequest> insuranceContracts);

    Order getOrder(Long customerId);
    List<Order> getCustomerOrders(Long userId);

    Order updateOrder(Long userId, OrderStatus status);

    OrderResponse convertToResponse(Order order);

    List<OrderResponse> convertToResponses(List<Order> orders);

    Map<String, Object> filterOrders(OrderFilterRequest filter, int page, int size);

    Order confirmOrder(Long adminId, Long orderId, OrderStatus status);

}
