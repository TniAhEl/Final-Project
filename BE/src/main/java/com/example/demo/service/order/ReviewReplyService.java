package com.example.demo.service.order;

import com.example.demo.dto.request.orders.CreateReviewReplyRequest;
import com.example.demo.dto.request.orders.UpdateReviewReplyRequest;
import com.example.demo.dto.response.order.AdminResponse;
import com.example.demo.dto.response.order.ReviewReplyResponse;
import com.example.demo.enums.ReviewStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.product.ProductReview;
import com.example.demo.model.product.ProductReviewReply;
import com.example.demo.repository.auth.AdminRepository;
import com.example.demo.repository.order.ProductReviewReplyRepository;
import com.example.demo.repository.order.ProductReviewRepository;
import com.example.demo.service.impl.order.IReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewReplyService implements IReviewReplyService {
    private final ProductReviewReplyRepository productReviewReplyRepository;
    private final ProductReviewRepository productReviewRepository;
    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;
    @Override
    public ProductReviewReply createReply(Long reviewId, Long adminId, CreateReviewReplyRequest request) {
        ProductReview review = productReviewRepository.findById(reviewId).orElseThrow(()-> new ResourceNotFoundException("Review not found!"));
        Admin admin = adminRepository.findById(adminId).orElseThrow(()-> new ResourceNotFoundException("Admin not found with id: "+ adminId));

        ProductReviewReply reply = new ProductReviewReply();
        reply.setCreateAt(LocalDateTime.now());
        reply.setUpdateAt(LocalDateTime.now());
        reply.setAdmin(admin);
        reply.setStatus(ReviewStatus.NEW);
        reply.setReply(request.getReply());
        reply.setProductReview(review);

        ProductReviewReply savedReply = productReviewReplyRepository.save(reply);

        review.setProductReviewReply(savedReply);

        return savedReply;
    }

    @Override
    public ProductReviewReply updateReply(Long id, UpdateReviewReplyRequest request) {
        ProductReviewReply reply = productReviewReplyRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Reply not found!"));

        reply.setReply(request.getReply());
        reply.setStatus(ReviewStatus.EDITED);
        return productReviewReplyRepository.save(reply);
    }

    @Override
    public ReviewReplyResponse convertToResponse(ProductReviewReply productReviewReply) {
        ReviewReplyResponse response = modelMapper.map(productReviewReply, ReviewReplyResponse.class);
        AdminResponse adminResponse = new AdminResponse();
        adminResponse.setId(productReviewReply.getAdmin().getId());
        adminResponse.setFirstName(productReviewReply.getAdmin().getFirstName());
        adminResponse.setLastName(productReviewReply.getAdmin().getLastName());
        adminResponse.setAdminRole(productReviewReply.getAdmin().getAdminRole());

        response.setAdmin(adminResponse);
        return response;
    }

    @Override
    public List<ReviewReplyResponse> convertToResponses(List<ProductReviewReply> productReviewReplyList) {
        return List.of();
    }
}
