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
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderReviewService implements IOrderReviewService {
    private final ModelMapper modelMapper;
    private final OrderProductRepository orderProductRepository;
    private final UserRepository userRepository;
    private final ProductReviewRepository productReviewRepository;
    private final EntityManager entityManager;


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
        orderProduct.setReviewed(true);

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
        StringBuilder sql = new StringBuilder("SELECT * FROM product_review WHERE 1=1 ");
        StringBuilder countSql = new StringBuilder("SELECT COUNT(*) FROM product_review WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (filter.getRating() != null) {
            sql.append(" AND rating = :rating");
            countSql.append(" AND rating = :rating");
            params.put("rating", filter.getRating());
        }

        if (filter.getStatus() != null) {
            sql.append(" AND status = :status");
            countSql.append(" AND status = :status");
            params.put("status", filter.getStatus().name()); // Enum to String
        }

        sql.append(" ORDER BY create_at DESC LIMIT :limit OFFSET :offset");
        params.put("limit", size);
        params.put("offset", page * size);

        Query query = entityManager.createNativeQuery(sql.toString(), ProductReview.class);
        Query countQuery = entityManager.createNativeQuery(countSql.toString());

        params.forEach((k, v) -> {
            query.setParameter(k, v);
            if (!k.equals("limit") && !k.equals("offset")) {
                countQuery.setParameter(k, v);
            }
        });

        @SuppressWarnings("unchecked")
        List<ProductReview> reviews = query.getResultList();
        List<ReviewResponse> responses = convertToResponses(reviews);
        Number totalItems = (Number) countQuery.getSingleResult();

        return Map.of(
                "data", responses,
                "currentPage", page,
                "totalItems", totalItems.longValue(),
                "totalPages", (int) Math.ceil(totalItems.doubleValue() / size)
        );
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

    @Override
    public List<ProductReview> getAllReviewByProductId(Long productId) {
        return productReviewRepository.findAllByProductId(productId);
    }


}
