package com.example.demo.service.impl.order;

import com.example.demo.dto.request.orders.CreateReviewRequest;
import com.example.demo.dto.request.orders.ReviewFilterRequest;
import com.example.demo.dto.request.orders.UpdateReviewRequest;
import com.example.demo.dto.response.order.ReviewResponse;
import com.example.demo.model.product.ProductReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IOrderReviewService {
    ProductReview createReview(Long orderProductId, Long userId, CreateReviewRequest request);
    ProductReview updateReview(Long id, UpdateReviewRequest request);
    Map<String , Object> filterReviews(ReviewFilterRequest filter, int page, int size);
    ReviewResponse convertToResponse(ProductReview productReview);
    List<ReviewResponse> convertToResponses(List<ProductReview> productReviews);
}
