package com.example.demo.service.order;

import com.example.demo.dto.request.orders.OrderFilterRequest;
import com.example.demo.dto.request.utilities.InsuranceContractRequest;
import com.example.demo.dto.request.utilities.OrderInforRequest;
import com.example.demo.dto.response.order.OrderProductResponse;
import com.example.demo.dto.response.order.OrderResponse;
import com.example.demo.enums.AdminRole;
import com.example.demo.enums.DiscountType;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.WarrantyStatus;
import com.example.demo.exception.OutOfRemainingResourceException;
import com.example.demo.exception.PermissionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderProduct;
import com.example.demo.model.product.Cart;
import com.example.demo.model.product.OrderProductSerial;
import com.example.demo.model.product.ProductOption;
import com.example.demo.model.utilities.*;
import com.example.demo.repository.InsuranceContractRepository;
import com.example.demo.repository.auth.AdminRepository;
import com.example.demo.repository.order.OrderProductRepository;
import com.example.demo.repository.order.OrderProductSerialRepository;
import com.example.demo.repository.order.OrderPromotionRepository;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.repository.product.ProductOptionRepository;
import com.example.demo.repository.utilities.InsuranceRepository;
import com.example.demo.repository.utilities.PromotionRepository;
import com.example.demo.repository.utilities.WarrantyProductCardRepository;
import com.example.demo.service.impl.order.IOrderService;
import com.example.demo.service.product.CartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private final InsuranceRepository insuranceRepository;

    private final CartService cartService;
    private final WarrantyProductCardRepository warrantyProductCardRepository;
    private final InsuranceContractRepository insuranceContractRepository;
    private final OrderProductRepository orderProductRepository;
    private final AdminRepository adminRepository;


    @Override
    public Order placeOrder(Long userId, OrderInforRequest request, String promotionCode, List<InsuranceContractRequest> insuranceContracts) {
        // 1. get user cart
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null || cart.getCartProducts().isEmpty()) {
            throw new ResourceNotFoundException("Cart is empty or not found");
        }

        // 2. create new order
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus(OrderStatus.PENDING);
        order.setCreateAt(LocalDateTime.now());
        order.setUpdateAt(LocalDateTime.now());
        order.setShippingAddress(request.getAddress());
        order.setType(request.getType());
        order.setNote(request.getNote());

        Order savedOrder = orderRepository.save(order);

        // 3. create list order product
        List<OrderProduct> orderProducts = createOrderProducts(savedOrder, cart);
        orderProductRepository.saveAll(orderProducts);

        savedOrder.setOrderProducts(orderProducts);

        List<OrderProductSerial> allSerials = new ArrayList<>();
        for (OrderProduct op : orderProducts) {
            List<OrderProductSerial> serials = createOrderProductSerials(op);
            allSerials.addAll(serials);
        }

        List<OrderProductSerial> orderProductSerials = orderProductSerialRepository.saveAll(allSerials);

        // 4. calculate total money
        BigDecimal totalMoney = calculateTotalMoney(orderProducts);
        savedOrder.setTotalMoney(totalMoney);

        // 5. apply promotion
        if (promotionCode != null && !promotionCode.isBlank()) {
            Promotion promotion = promotionRepository.findPromotionByCode(promotionCode);

            if (promotion.getRemainingQuantity() <= 0) {
                throw new IllegalStateException("Promotion code is out of stock");
            }


            totalMoney = calculateDiscount(totalMoney, promotion);


            // create map_order_promotion
            OrderPromotion map = new OrderPromotion();
            map.setOrder(savedOrder);
            map.setPromotion(promotion);
            map.setUpdateAt(LocalDateTime.now());
            orderPromotionRepository.save(map);

            // reduce the remaining quantity
            promotion.setRemainingQuantity(promotion.getRemainingQuantity() - 1);
            promotionRepository.save(promotion);
        }
        savedOrder.setTotalMoney(totalMoney);

        // 6. get product insurance and create an insurance contract
        if (insuranceContracts != null && !insuranceContracts.isEmpty()) {
            BigDecimal totalInsuranceFee = createInsuranceContracts(insuranceContracts, orderProducts, orderProductSerials);
            totalMoney = totalMoney.add(totalInsuranceFee); // Cộng phí bảo hiểm vào tổng tiền
        }


        // 7. create warranty card without a product serial id

            for (OrderProduct orderProduct : orderProducts) {
                WarrantyProductCard warrantyCard = new WarrantyProductCard();
                warrantyCard.setOrder(orderProduct.getOrder());
                warrantyCard.setStartDate(LocalDateTime.now());
                warrantyCard.setEndDate(LocalDateTime.now().plusMonths(12)); // VD: bảo hành 12 tháng
                warrantyCard.setStatus(WarrantyStatus.ACTIVE);
                warrantyProductCardRepository.save(warrantyCard);
            }

        // 8. save order

        savedOrder.setTotalMoney(totalMoney);
        Order finalOrder = orderRepository.save(savedOrder);
        //9. clear the user cart
        cartService.clearCart(cart.getId());

        return finalOrder;
    }

    private BigDecimal calculateDiscount(BigDecimal totalMoney, Promotion promotion) {
        if (promotion.getType() == DiscountType.AMOUNT) {
            return totalMoney.subtract(promotion.getValue());
        } else
            return totalMoney.multiply(BigDecimal.valueOf(100).subtract(promotion.getValue()).divide(BigDecimal.valueOf(100)));

    }

    private BigDecimal createInsuranceContracts(List<InsuranceContractRequest> insuranceRequests, List<OrderProduct> orderProducts, List<OrderProductSerial> savedSerials) {
        List<InsuranceContract> contractsToSave = new ArrayList<>();
        BigDecimal totalFee = BigDecimal.ZERO;

        for (InsuranceContractRequest icr : insuranceRequests) {
            // FIX: Tìm sản phẩm và bảo hiểm tương ứng
            OrderProduct relatedOrderProduct = orderProducts.stream()
                    .filter(op -> op.getProductOption().getId().equals(icr.getOrderProductId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Product option with id " + icr.getOrderProductId() + " not in this order."));

            Insurance insurance = insuranceRepository.findById(icr.getInsuranceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Insurance with id " + icr.getInsuranceId() + " not found."));

            // FIX: Lấy các serial thuộc về sản phẩm này
            List<OrderProductSerial> serialsForProduct = savedSerials.stream()
                    .filter(s -> s.getOrderProduct().equals(relatedOrderProduct))
                    .toList();

            if (serialsForProduct.size() < icr.getQuantity()) {
                throw new IllegalStateException("Not enough serials available for insurance for product option " + icr.getOrderProductId());
            }

            for (int i = 0; i < icr.getQuantity(); i++) {
                OrderProductSerial serial = serialsForProduct.get(i);
                InsuranceContract contract = new InsuranceContract();
                contract.setInsuranceFee(insurance.getFee());
                contract.setCoverageMoney(insurance.getCoverageMoney());
                contract.setCreate_at(LocalDate.now());
                contract.setInsurance(insurance);
                contract.setOrderProductSerial(serial);
                contractsToSave.add(contract);
                totalFee = totalFee.add(insurance.getFee());
            }
        }

        insuranceContractRepository.saveAll(contractsToSave); // FIX: Lưu tất cả hợp đồng bảo hiểm
        return totalFee;
    }

    private List<OrderProduct> createOrderProducts(Order order, Cart cart) {
        return cart.getCartProducts().stream().map(cartProduct -> {
            ProductOption productOption = cartProduct.getProductOption();
            if(productOption.getRemainingQuantity()==0|| productOption.getRemainingQuantity() >cartProduct.getQuantity()) {
                productOption.setRemainingQuantity(productOption.getRemainingQuantity() - cartProduct.getQuantity());
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
        return orderProducts.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    @Override
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
    }

    @Override
    public List<Order> getCustomerOrders(Long userId) {
        return orderRepository.findAllByUser_Id(userId);
    }

    @Override
    public Order updateOrder(Long userId, OrderStatus status) {
        Order order = orderRepository.findByUser_Id(userId);

        order.setStatus(status);

        return orderRepository.save(order);
    }

    @Override
    public OrderResponse convertToResponse(Order order) {
        OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

        List<OrderProduct> orderProducts = orderProductRepository.findByOrderId(order.getId());
        List<OrderProductResponse> orderProductResponses = orderProducts.stream().map(op -> {
            OrderProductResponse dto = new OrderProductResponse();
            dto.setId(op.getId());
            dto.setPrice(op.getUnitPrice());
            dto.setColorName(op.getProductOption().getColorName());
            dto.setRam(op.getProductOption().getRam());
            dto.setRom(op.getProductOption().getRom());
            dto.setName(op.getProductOption().getProduct().getName()); // <-- lấy từ Product
            return dto;
        }).toList();
        orderResponse.setOrderProducts(orderProductResponses);

        return orderResponse;
    }

    @Override
    public List<OrderResponse> convertToResponses(List<Order> orders) {
        return orders.stream().map(this::convertToResponse).toList();
    }

    @Override
    public Map<String, Object> filterOrders(OrderFilterRequest filter, int page, int size) {
        return Map.of();
    }

    @Override
    public Order confirmOrder(Long adminId, Long orderId, OrderStatus status) {
        //1 check admin id, if roleAdmin != Admin then throw exception that you have no permission
        Admin admin = adminRepository.findById(adminId).orElseThrow(()-> new ResourceNotFoundException("Admin not found with id"));
        if (admin.getAdminRole() != AdminRole.ADMIN) {
            throw new PermissionException("Admin has no permission!");
        }


        //2 check orderId, if not exists then throw exception that order not found with id
        // else get the order
        Order order = orderRepository.findById(orderId).orElseThrow(()-> new ResourceNotFoundException("Order not found with id: "+orderId));
        

        //3 get the insurance request by the order id, then
        // get the productoptionid and quantity and the insuranceId in the insurance request
        // use loop to get productserial that have the productoptionid with status AVAILABLE, change it to SOLD status
        // get the productserialId then create orderProductSerial set the productSerialId
        // create insuranceContract, set the orderproductSerialId and the insuranceId with the fee
        // set the insuranceContractId to the prooductSerialId
        // set the endDate of the insurance contract equal with currentdate + insuredTime

        // create warranty by orderId and productSerialId,




        return null;
    }
}
