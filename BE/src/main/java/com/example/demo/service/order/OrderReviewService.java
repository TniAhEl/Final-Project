package com.example.demo.service.order;

import com.example.demo.dto.request.orders.CreateReviewRequest;
import com.example.demo.dto.request.orders.ReviewFilterRequest;
import com.example.demo.dto.request.orders.UpdateReviewRequest;
import com.example.demo.dto.response.order.UserReview;
import com.example.demo.dto.response.order.ReviewResponse;
import com.example.demo.enums.ReviewStatus;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.auth.User;
import com.example.demo.model.order.OrderProduct;
import com.example.demo.model.product.ProductReview;
import com.example.demo.repository.auth.UserRepository;
import com.example.demo.repository.order.OrderProductRepository;
import com.example.demo.repository.order.ProductReviewRepository;
import com.example.demo.service.impl.order.IOrderReviewService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderReviewService implements IOrderReviewService {
    private final ModelMapper modelMapper;
    private final OrderProductRepository orderProductRepository;
    private final UserRepository userRepository;
    private final ProductReviewRepository productReviewRepository;


    @Override
    public ProductReview createReview(Long orderProductId, Long userId, CreateReviewRequest request) {
        OrderProduct orderProduct = orderProductRepository.findById(orderProductId).orElseThrow(()-> new ResourceNotFoundException("Order product not found!"));
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User not found!"));

        if(productReviewRepository.existsByUserIdAndOrderProductId(userId, orderProductId)){
            throw new AlreadyExistsException("User has reviewed the order!");
        }
        ProductReview review = new ProductReview();
        review.setOrderProduct(orderProduct);
        review.setUser(user);
        review.setCreateAt(LocalDateTime.now());
        review.setStatus(ReviewStatus.NEW);
        review.setReview(request.getReview());
        review.setRating(request.getRating());
        review.setUpdateAt(LocalDateTime.now());

        return productReviewRepository.save(review);
    }

    @Override
    public ProductReview updateReview(Long id, UpdateReviewRequest request) {
        ProductReview review = productReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found!"));

        review.setUpdateAt(LocalDateTime.now());
        review.setReview(request.getReview());
        // Kiểm tra nếu status từ request là null thì set giá trị "edited"
        review.setStatus(request.getStatus() != null ? request.getStatus() : ReviewStatus.EDITED);

        return productReviewRepository.save(review);
    }

    @Override
    public Map<String, Object> filterReviews(ReviewFilterRequest filter, int page, int size) {
        return Map.of();
    }

    @Override
    public ReviewResponse convertToResponse(ProductReview productReview) {
        ReviewResponse response =  modelMapper.map(productReview, ReviewResponse.class);
        UserReview userReview = new UserReview();
        userReview.setId(response.getUser().getId());
        userReview.setFirstName(response.getUser().getFirstName());
        userReview.setLastName(response.getUser().getLastName());
        response.setUser(userReview);
        return response;
    }

    @Override
    public List<ReviewResponse> convertToResponses(List<ProductReview> productReviews) {
        return productReviews.stream().map(this::convertToResponse).toList();
    }


}
