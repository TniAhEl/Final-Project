package com.example.demo.service.impl.order;

import com.example.demo.dto.request.FilterOrderWarranty;
import com.example.demo.dto.request.ListProductOrderRequest;
import com.example.demo.dto.request.orders.OrderFilterRequest;
import com.example.demo.dto.request.utilities.InsurancePendingRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import com.example.demo.dto.response.order.OrderResponse;
import com.example.demo.dto.response.order.OrderResponseDetail;
import com.example.demo.enums.OrderStatus;
import com.example.demo.model.order.Order;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface IOrderService {

    Order placeOrder(Long userId, OrderInforRequest request, String promotionCode, List<InsurancePendingRequest> insuranceContracts);

    @Transactional
    Order unknownPlaceOrder(ListProductOrderRequest list, OrderInforRequest request, String promotionCode, List<InsurancePendingRequest> requests);

    OrderResponseDetail getOrder(Long customerId);
    List<Order> getCustomerOrders(Long userId);

    Order updateOrder(Long userId, OrderStatus status);

    OrderResponse convertToResponse(Order order);

    List<OrderResponse> convertToResponses(List<Order> orders);

    OrderResponseDetail convertToDetail(Order order);

    Map<String, Object> filterOrders(OrderFilterRequest filter, int page, int size);

    Order confirmOrder(Long adminId, Long orderId, OrderStatus status);

    Order updateOrder(Long adminId, Long orderId, OrderStatus status);

    Map<String, Object> filterOrdersForUser(OrderFilterRequest filter, Long userId, int page, int size);

    Map<String, Object> filterOrderProductWarranty(FilterOrderWarranty filter, Long userId, int page, int size);
}
