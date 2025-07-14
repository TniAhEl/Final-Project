package com.example.demo.controller;

import com.example.demo.dto.request.orders.CreateReviewReplyRequest;
import com.example.demo.dto.request.orders.CreateReviewRequest;
import com.example.demo.dto.request.orders.UpdateReviewReplyRequest;
import com.example.demo.dto.request.orders.UpdateReviewRequest;
import com.example.demo.dto.request.utilities.InsuranceContractRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.order.OrderResponse;
import com.example.demo.dto.response.order.ReviewReplyResponse;
import com.example.demo.dto.response.order.ReviewResponse;
import com.example.demo.model.order.Order;
import com.example.demo.model.product.ProductReview;
import com.example.demo.model.product.ProductReviewReply;
import com.example.demo.service.impl.order.IOrderService;
import com.example.demo.service.impl.order.IOrderReviewService;
import com.example.demo.service.impl.order.IReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final IOrderService orderService;
    private final IOrderReviewService orderReviewService;
    private final IReviewReplyService reviewReplyService;


    @PostMapping("/order")
    public ResponseEntity<ApiResponse> createOrder(
            @RequestParam Long userId,
            @RequestParam(required = false) String promotionCode,
            @RequestBody OrderInforRequest request,
            @RequestBody(required = false) List<InsuranceContractRequest> insuranceContracts
    ) {
        try {
            Order order = orderService.placeOrder(userId, request, promotionCode, insuranceContracts);
            OrderResponse orderResponse = orderService.convertToResponse(order);
            return ResponseEntity.ok(new ApiResponse("Order placed successfully!", orderResponse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occurred while placing order", e.toString()));
        }
    }


    @PostMapping("order/product/review")
    public ResponseEntity<ApiResponse> createReview(
            @RequestParam Long orderProductId,
            @RequestParam Long userId,
            @RequestBody CreateReviewRequest request
            ){
        try{
            ProductReview review = orderReviewService.createReview(orderProductId, userId, request);
            ReviewResponse response = orderReviewService.convertToResponse(review);
            return ResponseEntity.ok(new ApiResponse("Review successfully", response));

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occur while reviewing product", e.toString()));
        }
    }

    @PutMapping("order/product/review")
    public ResponseEntity<ApiResponse> updateReview(
            @RequestParam Long id,
            @RequestBody UpdateReviewRequest request
    ){
        try{
            ProductReview review = orderReviewService.updateReview(id, request);
            ReviewResponse response = orderReviewService.convertToResponse(review);
            return ResponseEntity.ok(new ApiResponse("Update review successfully", response));

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occur while updating review", e.toString()));
        }
    }

    @PostMapping("order/product/review/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createReply(
            @RequestParam Long reviewId,
            @RequestParam Long adminId,
            @RequestBody CreateReviewReplyRequest request
    ){
        try{
            ProductReviewReply reply = reviewReplyService.createReply(reviewId, adminId, request);
            ReviewReplyResponse response = reviewReplyService.convertToResponse(reply);
            return ResponseEntity.ok(new ApiResponse("Reply review successfully", response));

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occur while Replying review", e.toString()));
        }
    }


    @PutMapping("order/product/review/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateReply(
            @RequestParam Long id,
            @RequestBody UpdateReviewReplyRequest request
    ){
        try{
            ProductReviewReply reply = reviewReplyService.updateReply(id, request);
            ReviewReplyResponse response = reviewReplyService.convertToResponse(reply);
            return ResponseEntity.ok(new ApiResponse("Update reply review successfully", response));

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error occur while updating reply review", e.toString()));
        }
    }
}
