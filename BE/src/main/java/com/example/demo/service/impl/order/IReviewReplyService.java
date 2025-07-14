package com.example.demo.service.impl.order;

import com.example.demo.dto.request.orders.CreateReviewReplyRequest;
import com.example.demo.dto.request.orders.UpdateReviewReplyRequest;
import com.example.demo.dto.response.order.ReviewReplyResponse;
import com.example.demo.model.product.ProductReviewReply;

import java.util.List;

public interface IReviewReplyService {
    ProductReviewReply createReply(Long reviewId, Long adminId, CreateReviewReplyRequest request);
    ProductReviewReply updateReply(Long id, UpdateReviewReplyRequest request);
    ReviewReplyResponse convertToResponse(ProductReviewReply productReviewReply);
    List<ReviewReplyResponse> convertToResponses(List<ProductReviewReply> productReviewReplyList);
}
