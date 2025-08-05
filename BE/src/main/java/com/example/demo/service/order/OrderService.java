package com.example.demo.service.order;

import com.example.demo.dto.request.FilterOrderWarranty;
import com.example.demo.dto.request.ListProductOrderRequest;
import com.example.demo.dto.request.orders.OrderFilterRequest;
import com.example.demo.dto.request.utilities.InsurancePendingRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.dto.response.WarrantyProductInfo;
import com.example.demo.dto.response.order.*;
import com.example.demo.dto.response.utility.PromotionResponse;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.enums.*;
import com.example.demo.exception.OutOfRemainingResourceException;
import com.example.demo.exception.PermissionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.auth.User;
import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderProduct;
import com.example.demo.model.order.OrderTransport;
import com.example.demo.model.product.Cart;
import com.example.demo.model.product.OrderProductSerial;
import com.example.demo.model.product.ProductOption;
import com.example.demo.model.product.ProductSerial;
import com.example.demo.model.utilities.*;
import com.example.demo.repository.InsuranceContractRepository;
import com.example.demo.repository.auth.AdminRepository;
import com.example.demo.repository.auth.UserRepository;
import com.example.demo.repository.order.*;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.repository.product.ProductOptionRepository;
import com.example.demo.repository.product.ProductSerialRepository;
import com.example.demo.repository.utilities.*;
import com.example.demo.service.impl.order.IOrderService;
import com.example.demo.service.product.CartService;
import com.example.demo.service.utility.InsuranceService;
import com.example.demo.service.utility.MailService;
import com.example.demo.service.utility.WarrantyService;
import com.example.demo.util.InsuranceIDGenerator;
import com.example.demo.util.TrackingNumberGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final OrderProductSerialRepository orderProductSerialRepository;
    private final CartRepository cartRepository;
    private final ModelMapper modelMapper;
    private final ProductOptionRepository productOptionRepository;
    private final PromotionRepository promotionRepository;
    private final OrderPromotionRepository orderPromotionRepository;
    private final WarrantyService warrantyService;
    private final InsuranceService insuranceService;
    private final InsurancePendingsRepository insurancePendingsRepository;

    private final CartService cartService;
    private final WarrantyProductCardRepository warrantyProductCardRepository;
    private final InsuranceContractRepository insuranceContractRepository;
    private final OrderProductRepository orderProductRepository;
    private final AdminRepository adminRepository;
    private final EntityManager entityManager;
    private final UserRepository userRepository;
    private final ProductSerialRepository productSerialRepository;
    private final OrderTransportRepository orderTransportRepository;
    private final WarrantyRepository warrantyRepository;
    private final MailService mailService;

    @Override
    @Transactional
    public Order placeOrder(Long userId, OrderInforRequest request, String promotionCode, List<InsurancePendingRequest> requests) {
        // 1. get user cart
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null || cart.getCartProducts().isEmpty()) {
            throw new ResourceNotFoundException("Cart is empty or not found");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id:" + userId));

        // 2. create new order
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus(OrderStatus.PENDING);
        order.setCreateAt(LocalDateTime.now());
        order.setUpdateAt(LocalDateTime.now());
        order.setName(request.getName());
        order.setShippingAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setEmail(request.getEmail());
        order.setType(request.getType());
        order.setNote(request.getNote());
        order.setMethod(request.getMethod());
        order.setOrderCode(generateOrderCode());

        Order savedOrder = orderRepository.save(order);

        // 3. create list order product
        List<OrderProduct> orderProducts = createOrderProducts(savedOrder, cart);
        orderProductRepository.saveAll(orderProducts);


        savedOrder.setOrderProducts(orderProducts);

        // 4. calculate total money
        BigDecimal totalMoney = calculateTotalMoney(orderProducts);
        savedOrder.setTotalMoney(totalMoney);

        // 5. apply promotion
        if (promotionCode != null && !promotionCode.isBlank()) {
            Promotion promotion = promotionRepository.findPromotionByCode(promotionCode);

            if (promotion.getRemainingQuantity() <= 0) {
                throw new IllegalStateException("Promotion code is out of stock");
            }

            // create map_order_promotion
            OrderPromotion map = new OrderPromotion();
            map.setOrder(savedOrder);
            map.setPromotion(promotion);
            map.setUpdateAt(LocalDateTime.now());
            map.setTotalDiscount(totalMoney.subtract(calculateDiscount(totalMoney, promotion)));
            orderPromotionRepository.save(map);

            totalMoney = calculateDiscount(totalMoney, promotion);

            // reduce the remaining quantity
            promotion.setRemainingQuantity(promotion.getRemainingQuantity() - 1);
            promotionRepository.save(promotion);
        }
        savedOrder.setTotalMoney(totalMoney);

        //6 create insurancepending
        if (requests != null && !requests.isEmpty()) {
            List<InsurancePending> insurancePendings = insuranceService.createInsurancePendings(requests, savedOrder.getId());

            BigDecimal totalInsuranceMoney = insurancePendings.stream().map(InsurancePending::getTotalfee).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);

            insurancePendingsRepository.saveAll(insurancePendings);
            savedOrder.setTotalMoney(savedOrder.getTotalMoney().add(totalInsuranceMoney));
        }


        String name = user.getFirstName() + " " + user.getLastName();
        Order finalOrder = orderRepository.save(savedOrder);
        mailService.sendOrderSummaryEmail(user.getEmail(), name, order.getOrderCode(), orderProducts, order.getTotalMoney());


        // 8. save order


        //9. clear the user cart
        cartService.clearCart(cart.getId());

        return finalOrder;
    }

    @Transactional
    @Override
    public Order unknownPlaceOrder(ListProductOrderRequest list, OrderInforRequest request, String promotionCode, List<InsurancePendingRequest> requests) {
        // 1. Tạo order
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        order.setCreateAt(LocalDateTime.now());
        order.setUpdateAt(LocalDateTime.now());
        order.setName(request.getName());
        order.setShippingAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setEmail(request.getEmail());
        order.setType(request.getType());
        order.setNote(request.getNote());
        order.setMethod(request.getMethod());
        order.setOrderCode(generateOrderCode());

        Order savedOrder = orderRepository.save(order);

        // 2. Tạo danh sách orderProduct từ request list
        List<OrderProduct> orderProducts = list.getProducts().stream().map(product -> {
            ProductOption option = productOptionRepository.findById(product.getProductOptionId()).orElseThrow(() -> new ResourceNotFoundException("Product option not found"));


            if (option.getRemainingQuantity() - option.getReversedQuantity() < product.getQuantity()) {
                throw new IllegalStateException("Product option " + option.getId() + " does not have enough quantity");
            }

            OrderProduct op = new OrderProduct();
            op.setProductOption(option);
            op.setOrder(savedOrder);
            op.setQuantity(product.getQuantity());
            op.setUnitPrice(option.getPrice());
            op.setUpdateAt(LocalDateTime.now());

            option.setReversedQuantity(option.getReversedQuantity() + product.getQuantity());
            productOptionRepository.save(option);

            return op;
        }).collect(Collectors.toList());

        orderProductRepository.saveAll(orderProducts);
        savedOrder.setOrderProducts(orderProducts);


        // 3. Tính tổng tiền
        BigDecimal totalMoney = calculateTotalMoney(orderProducts);

        savedOrder.setTotalMoney(totalMoney);

        // 4. Áp dụng promotion nếu có
        if (promotionCode != null && !promotionCode.isBlank()) {
            Promotion promotion = promotionRepository.findPromotionByCode(promotionCode);


            if (promotion.getRemainingQuantity() <= 0) {
                throw new IllegalStateException("Promotion code is out of stock");
            }

            OrderPromotion map = new OrderPromotion();
            map.setOrder(savedOrder);
            map.setPromotion(promotion);
            map.setUpdateAt(LocalDateTime.now());

            BigDecimal discounted = calculateDiscount(totalMoney, promotion);
            BigDecimal discountAmount = totalMoney.subtract(discounted);
            map.setTotalDiscount(discountAmount);
            orderPromotionRepository.save(map);

            totalMoney = discounted;
            savedOrder.setTotalMoney(totalMoney);

            promotion.setRemainingQuantity(promotion.getRemainingQuantity() - 1);
            promotionRepository.save(promotion);


        }

        // 5. Tạo insurance nếu có
        if (requests != null && !requests.isEmpty()) {
            List<InsurancePending> insurancePendings = insuranceService.createInsurancePendings(requests, savedOrder.getId());

            BigDecimal totalInsuranceMoney = insurancePendings.stream().map(InsurancePending::getTotalfee).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);

            insurancePendingsRepository.saveAll(insurancePendings);
            savedOrder.setTotalMoney(savedOrder.getTotalMoney().add(totalInsuranceMoney));


        }

        // 6. Lưu lại order
        orderRepository.save(savedOrder);


        // 7. Gửi email
        mailService.sendOrderSummaryEmail(order.getEmail(), order.getName(), order.getOrderCode(), savedOrder.getOrderProducts(), savedOrder.getTotalMoney());

        return savedOrder;
    }


    private BigDecimal calculateDiscount(BigDecimal totalMoney, Promotion promotion) {
        if (promotion.getType() == DiscountType.AMOUNT) {
            return totalMoney.subtract(promotion.getValue());
        } else
            return totalMoney.multiply(BigDecimal.valueOf(100).subtract(promotion.getValue()).divide(BigDecimal.valueOf(100)));

    }

    private List<OrderProduct> createOrderProducts(Order order, Cart cart) {
        return cart.getCartProducts().stream().map(cartProduct -> {
            ProductOption productOption = cartProduct.getProductOption();
            if (productOption.getRemainingQuantity() > 0 && productOption.getRemainingQuantity() >= productOption.getReversedQuantity() + cartProduct.getQuantity()) {
                productOption.setReversedQuantity(cartProduct.getQuantity() + productOption.getReversedQuantity());
            } else {
                throw new OutOfRemainingResourceException("The remaining quantity of the product is not enough to place order");
            }
            ProductOption updateOption = productOptionRepository.save(productOption);

            return new OrderProduct(order, updateOption, productOption.getPrice(), cartProduct.getQuantity());
        }).collect(Collectors.toList());
    }

    private List<OrderProductSerial> createOrderProductSerials(OrderProduct orderProduct) {
        List<OrderProductSerial> serials = new ArrayList<>();

        for (int i = 0; i < orderProduct.getQuantity(); i++) {
            OrderProductSerial serial = new OrderProductSerial();
            serial.setOrderProduct(orderProduct);
            serial.setUpdateAt(LocalDateTime.now());
            serials.add(serial);
        }
        return serials;
    }


    private BigDecimal calculateTotalMoney(List<OrderProduct> orderProducts) {
        return orderProducts.stream().map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    @Override
    public OrderResponseDetail getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
        return convertToDetail(order);
    }

    @Override
    public List<Order> getCustomerOrders(Long userId) {
        return orderRepository.findAllByUser_Id(userId);
    }

    @Override
    public Order updateOrder(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
        if (status == OrderStatus.CANCELLED && order.getStatus() == OrderStatus.PENDING) {
            List<OrderProduct> orderProducts = orderProductRepository.findAllByOrder_Id(orderId);

            for (OrderProduct orderProduct : orderProducts) {
                ProductOption option = productOptionRepository.findById(orderProduct.getProductOption().getId()).orElseThrow(() -> new ResourceNotFoundException("Option not found!"));
                option.setReversedQuantity(option.getReversedQuantity() - orderProduct.getQuantity());
                orderProduct.setReviewed(false);
                orderProductRepository.save(orderProduct);
                productOptionRepository.save(option);
            }
        }
        order.setStatus(status);

        return orderRepository.save(order);
    }

    @Override
    public OrderResponse convertToResponse(Order order) {
        OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);
//
//        List<OrderProduct> orderProducts = orderProductRepository.findByOrderId(order.getId());
//        List<OrderProductResponse> orderProductResponses = orderProducts.stream().map(op -> {
//            OrderProductResponse dto = new OrderProductResponse();
//            dto.setId(op.getId());
//            dto.setPrice(op.getUnitPrice());
//            dto.setColorName(op.getProductOption().getColorName());
//            dto.setRam(op.getProductOption().getRam());
//            dto.setRom(op.getProductOption().getRom());
//            dto.setName(op.getProductOption().getProduct().getName());
//            dto.setProductId(op.getProductOption().getProduct().getId());
//            return dto;
//        }).toList();


        return orderResponse;
    }


    @Override
    public List<OrderResponse> convertToResponses(List<Order> orders) {
        return orders.stream().map(this::convertToResponse).toList();
    }

    @Override
    public OrderResponseDetail convertToDetail(Order order) {
        OrderResponseDetail orderResponse = modelMapper.map(order, OrderResponseDetail.class);

        List<OrderProduct> orderProducts = orderProductRepository.findByOrderId(order.getId());
        List<OrderProductResponse> orderProductResponses = orderProducts.stream().map(op -> {
            OrderProductResponse dto = new OrderProductResponse();
            dto.setId(op.getId());
            dto.setPrice(op.getUnitPrice());
            dto.setColorName(op.getProductOption().getColorName());
            dto.setRam(op.getProductOption().getRam());
            dto.setRom(op.getProductOption().getRom());
            dto.setName(op.getProductOption().getProduct().getName());
            dto.setProductId(op.getProductOption().getProduct().getId());
            return dto;
        }).toList();

        orderResponse.setOrderProducts(orderProductResponses);

        User user = userRepository.findById(order.getUser().getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        orderResponse.setUser(userResponse);

        OrderTransport transport = orderTransportRepository.findByOrderId(order.getId());
        OrderTransportResponse transportResponse = null;
        if (transport != null) {
            transportResponse = modelMapper.map(transport, OrderTransportResponse.class);
        }
        orderResponse.setTransport(transportResponse); // Không bị lỗi khi null

        OrderPromotion orderPromotion = orderPromotionRepository.findByOrderId(order.getId());
        if (orderPromotion != null && orderPromotion.getPromotion() != null) {
            Promotion promotion = promotionRepository.findById(orderPromotion.getPromotion().getId()).orElseThrow(() -> new ResourceNotFoundException("Promotion not found"));

            PromotionResponse promotionInfo = modelMapper.map(promotion, PromotionResponse.class);
            OrderPromotionResponse orderPromotionResponse = modelMapper.map(orderPromotion, OrderPromotionResponse.class);
            orderPromotionResponse.setPromotionInfo(promotionInfo);
            orderResponse.setPromotionResponse(orderPromotionResponse);
        } else {
            orderResponse.setPromotionResponse(null);
        }

        return orderResponse;
    }

    @Override
    public Map<String, Object> filterOrders(OrderFilterRequest filter, int page, int size) {
        String baseSql = """
                    SELECT * FROM order_table WHERE 1=1
                """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (filter.getTypes() != null && !filter.getTypes().isEmpty()) {
            where.append(" AND type IN :types");
            params.put("types", filter.getTypes());
        }

        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            where.append(" AND order_status IN :statuses");
            List<String> statusNames = filter.getStatuses().stream().map(Enum::name).collect(Collectors.toList());
            params.put("statuses", statusNames);
        }

        if (filter.getPromotionCodes() != null && !filter.getPromotionCodes().isEmpty()) {
            where.append(" AND promotion_code IN :promotionCodes");
            params.put("promotionCodes", filter.getPromotionCodes());
        }

        if (filter.getStartDate() != null) {
            where.append(" AND created_at >= :startDate");
            params.put("startDate", filter.getStartDate());
        }

        if (filter.getEndDate() != null) {
            where.append(" AND created_at <= :endDate");
            params.put("endDate", filter.getEndDate());
        }

        if (filter.getMinTotalMoney() != null) {
            where.append(" AND total_money >= :minTotalMoney");
            params.put("minTotalMoney", filter.getMinTotalMoney());
        }

        if (filter.getMaxTotalMoney() != null) {
            where.append(" AND total_money <= :maxTotalMoney");
            params.put("maxTotalMoney", filter.getMaxTotalMoney());
        }

        String orderBy = " ORDER BY id ASC";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = baseSql + where + orderBy + limitOffset;
        String countSql = "SELECT COUNT(*) FROM order_table WHERE 1=1" + where;

        Query query = entityManager.createNativeQuery(finalSql, Order.class);
        Query countQuery = entityManager.createNativeQuery(countSql);

        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setParameter("limit", size);
        query.setParameter("offset", page * size);

        @SuppressWarnings("unchecked") List<Order> orders = query.getResultList();

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> result = new HashMap<>();
        result.put("content", convertToResponses(orders));
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }


    @Override
    @Transactional
    public Order confirmOrder(Long adminId, Long orderId, OrderStatus status) {
        // 1. Kiểm tra quyền admin
        Admin admin = adminRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));
        if (admin.getAdminRole() != AdminRole.ADMIN) {
            throw new PermissionException("Admin has no permission!");
        }


        // 2. Kiểm tra đơn hàng
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));


        // 3. Lấy các sản phẩm trong đơn hàng
        List<OrderProduct> orderProducts = orderProductRepository.findAllByOrder_Id(orderId);

        for (OrderProduct orderProduct : orderProducts) {
            Long productOptionId = orderProduct.getProductOption().getId();
            int quantity = orderProduct.getQuantity();

            // 3.0
            ProductOption productOption = productOptionRepository.findById(productOptionId).orElseThrow(() -> new ResourceNotFoundException("Product option not found!"));
            productOption.setRemainingQuantity(productOption.getRemainingQuantity() - orderProduct.getQuantity());
            productOption.setReversedQuantity(productOption.getReversedQuantity() - orderProduct.getQuantity());
            productOption.setSoldQuantity(productOption.getSoldQuantity() + orderProduct.getQuantity());
            productOptionRepository.save(productOption);

            // 3.1 Lấy serial AVAILABLE
            List<ProductSerial> availableSerials = productSerialRepository.findAllByProductListConfigStatusAndProductOption_Id(ProductSerialStatus.AVAILABLE, productOptionId);

            // 3.2 Kiểm tra số lượng serial
            if (availableSerials.size() < quantity) {
                throw new IllegalStateException("Không đủ serial AVAILABLE cho sản phẩm optionId = " + productOptionId);
            }

            // 3.3 Lấy đúng số lượng cần
            List<ProductSerial> serialsToUse = availableSerials.subList(0, quantity);

            for (ProductSerial serial : serialsToUse) {
                // 3.4 Cập nhật trạng thái serial
                serial.setProductListConfigStatus(ProductSerialStatus.SOLD);
                productSerialRepository.save(serial);

                // 3.5 Tạo bản ghi OrderProductSerial
                OrderProductSerial ops = new OrderProductSerial();
                ops.setOrderProduct(orderProduct);
                ops.setProductSerial(serial);
                ops.setUpdateAt(LocalDateTime.now());
                orderProductSerialRepository.save(ops);

                // 3.6 Tạo thẻ bảo hành
                WarrantyProductCard warrantyCard = new WarrantyProductCard();
                warrantyCard.setOrder(order);
                warrantyCard.setProductSerial(serial);
                warrantyCard.setStatus(WarrantyStatus.ACTIVE);
                warrantyCard.setStartDate(LocalDateTime.now());
                warrantyCard.setEndDate(LocalDateTime.now().plusMonths(12));
                warrantyProductCardRepository.save(warrantyCard);

                // 3.7 Tạo hợp đồng bảo hiểm nếu có4

                List<InsurancePending> pendingList = insurancePendingsRepository.findByOrderAndOrderProduct(orderId, productOptionId);
                System.out.println("Pending size: " + pendingList.size());
                System.out.println("Order ID: " + orderId);
                System.out.println("Product option ID: " + productOptionId);
                for (InsurancePending pending : pendingList) {
                    pending.setStatus(PendingStatus.CONFIRM);
                    if (pending.getQuantity() > 0) {
                        InsuranceContract contract = new InsuranceContract();
                        contract.setInsurance(pending.getInsurance());
                        contract.setExpireDate(LocalDate.now().plusMonths(pending.getInsurance().getInsured()));
                        contract.setStatus(ContractStatus.ACTIVE);
                        contract.setOrderProductSerial(ops);
                        contract.setCreate_at(LocalDate.from(LocalDateTime.now()));
                        contract.setCoverageMoney(pending.getInsurance().getCoverageMoney());
                        contract.setInsuranceFee(pending.getInsurance().getFee());

                        String code = InsuranceIDGenerator.generate(contract.getInsurance().getName(), LocalDate.from(contract.getCreate_at()));
                        contract.setCode(code);
                        insuranceContractRepository.save(contract);

                        pending.setQuantity(pending.getQuantity() - 1);
                        insurancePendingsRepository.save(pending);
                    }
                }
            }

        }

        // 4. Cập nhật trạng thái đơn hàng
        order.setStatus(status); // Ví dụ: CONFIRMED
        order.setUpdateAt(LocalDateTime.now());


        // 5. Create Transportation
        OrderTransport transport = new OrderTransport();
        transport.setCreateAt(LocalDateTime.now());
        transport.setShippingMethod(order.getMethod());
        transport.setShippingAddress(order.getShippingAddress());
        transport.setShip(TransportStatus.PROCESSING);
        transport.setUpdateAt(LocalDateTime.now());
        transport.setOrder(order);
        String trackingNumber = TrackingNumberGenerator.generate(LocalDate.from(transport.getUpdateAt()), transport.getShippingAddress(), transport.getShippingMethod());
        transport.setTrackingNumber(trackingNumber);
        orderTransportRepository.save(transport);

        order.setOrderTransport(transport);
        orderRepository.save(order);


        mailService.sendOrderEmail(order.getEmail(), order.getName(), order.getOrderCode(), orderProducts, order.getTotalMoney());

        return order;
    }

    @Override
    @Transactional
    public Order updateOrder(Long adminId, Long orderId, OrderStatus status) {
        Admin admin = adminRepository.findById(adminId).orElseThrow(() -> new ResourceNotFoundException("Admin not found with id:" + adminId));

        if (admin.getAdminRole() != AdminRole.ADMIN) {
            throw new PermissionException("Admin has no permission!");
        }

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Check order status and update status

        if (order.getStatus() == OrderStatus.CONFIRM && status == OrderStatus.RECEIVED) {
            List<OrderProduct> orderProducts = orderProductRepository.findAllByOrder_Id(orderId);
            for (OrderProduct product : orderProducts) {
                ProductOption option = productOptionRepository.findById(product.getProductOption().getId()).orElseThrow(() -> new ResourceNotFoundException("Option not found!"));
                option.setReversedQuantity(option.getReversedQuantity() - product.getQuantity());
                product.setReviewed(false);
                productOptionRepository.save(option);
                orderProductRepository.save(product);
            }
            order.setStatus(status);
        } else if (order.getStatus() == OrderStatus.PENDING && status == OrderStatus.CANCELLED) {
            order.setStatus(status);
            List<InsurancePending> insurancePending = insurancePendingsRepository.findAllByOrderId(orderId);

            for (InsurancePending pending : insurancePending) {
                pending.setStatus(PendingStatus.CANCELLED);
                insurancePendingsRepository.save(pending);
            }

        }



        orderRepository.save(order);
        return order;
    }

    @Override
    public Map<String, Object> filterOrdersForUser(OrderFilterRequest filter, Long userId, int page, int size) {
        String baseSql = """
                    SELECT * FROM order_table WHERE 1=1
                """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        // Lọc theo userId
        if (userId != null) {
            where.append(" AND user_id = :userId");
            params.put("userId", userId);
        }

        if (filter.getTypes() != null && !filter.getTypes().isEmpty()) {
            where.append(" AND type IN :types");
            params.put("types", filter.getTypes());
        }

        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            where.append(" AND order_status IN :statuses");
            List<String> statusNames = filter.getStatuses().stream().map(Enum::name).collect(Collectors.toList());
            params.put("statuses", statusNames);
        }

//        if (filter.getPromotionCodes() != null && !filter.getPromotionCodes().isEmpty()) {
//            where.append(" AND promotion_code IN :promotionCodes");
//            params.put("promotionCodes", filter.getPromotionCodes());
//        }

        if (filter.getStartDate() != null) {
            where.append(" AND create_at >= :startDate");
            params.put("startDate", filter.getStartDate());
        }

        if (filter.getEndDate() != null) {
            where.append(" AND create_at <= :endDate");
            params.put("endDate", filter.getEndDate());
        }

        if (filter.getMinTotalMoney() != null) {
            where.append(" AND total_money >= :minTotalMoney");
            params.put("minTotalMoney", filter.getMinTotalMoney());
        }

        if (filter.getMaxTotalMoney() != null) {
            where.append(" AND total_money <= :maxTotalMoney");
            params.put("maxTotalMoney", filter.getMaxTotalMoney());
        }

        String orderBy = " ORDER BY id ASC";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = baseSql + where + orderBy + limitOffset;
        String countSql = "SELECT COUNT(*) FROM order_table WHERE 1=1" + where;

        Query query = entityManager.createNativeQuery(finalSql, Order.class);
        Query countQuery = entityManager.createNativeQuery(countSql);

        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setParameter("limit", size);
        query.setParameter("offset", page * size);

        @SuppressWarnings("unchecked") List<Order> orders = query.getResultList();

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> result = new HashMap<>();
        result.put("content", convertToResponses(orders));
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }


    @Override
    public Map<String, Object> filterOrderProductWarranty(FilterOrderWarranty filter, Long userId, int page, int size) {
        String baseSql = """
                    SELECT 
                        wc.id, wc.start_date, wc.end_date, wc.status, 
                        ps.serial_number, 
                        p.name,
                        p.warranty_id  -- Thêm để lấy warrantyId từ bảng product
                    FROM warranty_card wc
                    JOIN order_table o ON wc.order_id = o.id
                    JOIN product_serial ps ON wc.product_serial_id = ps.id
                    JOIN product_option po ON ps.product_option_id = po.id
                    JOIN product p ON po.product_id = p.id
                    WHERE 1=1
                """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (userId != null) {
            where.append(" AND o.user_id = :userId");
            params.put("userId", userId);
        }

        if (filter.getStatuses() != null && !filter.getStatuses().isEmpty()) {
            where.append(" AND wc.status IN :statuses");
            List<String> statusNames = filter.getStatuses().stream().map(Enum::name).collect(Collectors.toList());
            params.put("statuses", statusNames);
        }

        String orderBy = " ORDER BY wc.id ASC";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = baseSql + where + orderBy + limitOffset;
        String countSql = """
                    SELECT COUNT(*)
                    FROM warranty_card wc
                    JOIN order_table o ON wc.order_id = o.id
                    JOIN product_serial ps ON wc.product_serial_id = ps.id
                    JOIN product_option po ON ps.product_option_id = po.id
                    JOIN product p ON po.product_id = p.id
                    WHERE 1=1
                """ + where;

        Query query = entityManager.createNativeQuery(finalSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setParameter("limit", size);
        query.setParameter("offset", page * size);

        List<Object[]> rawResults = query.getResultList();
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        List<WarrantyProductInfo> warrantyInfos = rawResults.stream().map(row -> {
            WarrantyProductInfo info = new WarrantyProductInfo();

            info.setId(row[0] != null ? ((Number) row[0]).longValue() : null);
            info.setStartDate(row[1] instanceof Timestamp ts ? ts.toLocalDateTime() : null);
            info.setEndDate(row[2] instanceof Timestamp ts ? ts.toLocalDateTime() : null);
            info.setStatus(row[3] != null ? WarrantyStatus.valueOf(row[3].toString()) : null);
            info.setSerial(row[4] != null ? row[4].toString() : null);
            info.setProductName(row[5] != null ? row[5].toString() : null);

            // Lấy warranty_id từ product
            Long warrantyPolicyId = row[6] != null ? ((Number) row[6]).longValue() : null;
            WarrantyResponse warrantyResponse = null;
            if (warrantyPolicyId != null) {
                warrantyResponse = warrantyRepository.findById(warrantyPolicyId).map(warrantyService::convertToResponse).orElse(null);
            }
            info.setWarrantyResponse(warrantyResponse);

            return info;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("content", warrantyInfos);
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }

    public String generateOrderCode() {
        String prefix = "ORD"; // hoặc "DH", "HD", tùy bạn
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = new Random().nextInt(900) + 100; // 100 - 999
        return prefix + datePart + random;
    }


}
