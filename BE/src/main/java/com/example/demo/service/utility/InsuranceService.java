package com.example.demo.service.utility;

import com.example.demo.dto.request.FilterInsuranceContract;
import com.example.demo.dto.request.utilities.CreateInsuranceRequest;
import com.example.demo.dto.request.utilities.InsurancePendingRequest;
import com.example.demo.dto.request.utilities.UpdateInsuranceRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.dto.response.utility.InsuranceContractResponse;
import com.example.demo.dto.response.utility.InsuranceResponse;
import com.example.demo.enums.InsuranceStatus;
import com.example.demo.enums.PendingStatus;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderProduct;
import com.example.demo.model.utilities.Insurance;
import com.example.demo.model.utilities.InsurancePending;
import com.example.demo.repository.order.OrderProductRepository;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.utilities.InsurancePendingsRepository;
import com.example.demo.repository.utilities.InsuranceRepository;
import com.example.demo.service.impl.utility.IInsuranceService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsuranceService implements IInsuranceService {
    private final InsuranceRepository insuranceRepository;
    private final InsurancePendingsRepository insurancePendingsRepository;
    private final OrderRepository orderRepository;

    private final EntityManager entityManager;
    private final OrderProductRepository orderProductRepository;
    private final ModelMapper modelMapper;
    @Override
    public Insurance getInsuranceById(Long id) {
        return insuranceRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Insurance not found !"));
    }

    @Override
    public List<Insurance> getAllInsurance() {
        return insuranceRepository.findAll();
    }

    @Override
    public Insurance createInsurance(CreateInsuranceRequest request) {
        if(insuranceRepository.existsByName(request.getName()) && insuranceRepository.existsByProvider(request.getProvider())){
            throw new AlreadyExistsException("Insurance already exists with name "+ request.getName() +" and provider " +request.getProvider());
        }

        Insurance insurance = new Insurance();
        insurance.setName(request.getName());
        insurance.setReleaseAt(request.getReleaseAt());
        insurance.setInsured(request.getInsured());
        insurance.setTerms(request.getTerms());
        insurance.setStatus(InsuranceStatus.ACTIVE);
        insurance.setCoverageMoney(request.getCoverageMoney());
        insurance.setProvider(request.getProvider());
        insurance.setFee(request.getFee());
        insurance.setCreateAt(LocalDateTime.now());
        insurance.setUpdateAt(LocalDateTime.now());



        return insuranceRepository.save(insurance);
    }

    @Override
    public Insurance updateInsurance(UpdateInsuranceRequest request, Long id) {

        Insurance existingInsurance = insuranceRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Insurance not found with id:" + id));

        existingInsurance.setName(request.getName());
        existingInsurance.setReleaseAt(request.getReleaseAt());
        existingInsurance.setInsured(request.getInsured());
        existingInsurance.setTerms(request.getTerms());
        existingInsurance.setStatus(request.getStatus());
        existingInsurance.setCoverageMoney(request.getCoverageMoney());
        existingInsurance.setProvider(request.getProvider());
        existingInsurance.setFee(request.getFee());
        existingInsurance.setUpdateAt(LocalDateTime.now());

        return insuranceRepository.save(existingInsurance);
    }

    @Override
    public InsuranceResponse convertToResponse(Insurance insurance) {
        return modelMapper.map(insurance, InsuranceResponse.class);
    }

    @Override
    public List<InsuranceResponse> convertToResponses(List<Insurance> insurances) {
        return insurances.stream().map(this::convertToResponse).toList();
    }

    @Override
    public Map<String, Object> filterUserInsuranceContract(FilterInsuranceContract filter, int page, int size) {
        String baseSql = """
            SELECT
            ic.*,
            i.name, i.release_at, i.insured, i.terms, i.status, i.coverage_money, i.provider, i.fee,
            ps.serial_number,
            c.fname, c.lname, c.bday, c.address, c.email, c.phone
            FROM insurance_contract ic
            JOIN insurance i ON ic.insurance_id = i.id
            JOIN order_product_serial ops ON ops.id = ic.order_product_serial_id
            JOIN product_serial ps ON ps.id = ops.serial_id
            JOIN order_product op ON op.id = ops.order_product_id
            JOIN order_table o ON o.id = op.order_id
            JOIN customer c ON c.id = o.user_id
            WHERE 1=1
            """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (filter.getContractName() != null) {
            where.append(" AND i.name = :insuranceName ");
            params.put("insuranceName", filter.getContractName());
        }

        if (filter.getUserId() != null) {
            where.append(" AND c.id = :userId ");
            params.put("userId", filter.getUserId());
        }

        if (filter.getStatus() != null) {
            where.append(" AND ic.contract_status = :status ");
            params.put("status", filter.getStatus());
        }

        String orderBy = " ORDER BY ic.id ASC ";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = baseSql + where + orderBy + limitOffset;
        String countSql = """
            SELECT COUNT(*)
            FROM insurance_contract ic
            JOIN insurance i ON ic.insurance_id = i.id
            JOIN order_product_serial ops ON ops.id = ic.order_product_serial_id
            JOIN product_serial ps ON ps.id = ops.serial_id
            JOIN order_product op ON op.id = ops.order_product_id
            JOIN order_table o ON o.id = op.order_id
            JOIN customer c ON c.id = o.user_id
            WHERE 1=1
            """ + where;

        Query query = entityManager.createNativeQuery(finalSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        // set parameters cho filter
        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setParameter("limit", size);
        query.setParameter("offset", page * size);

        List<Object[]> rawResults = query.getResultList();
        List<InsuranceContractResponse> responses = rawResults.stream()
                .map(this::mapRowToResponse)
                .toList();
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> result = new HashMap<>();
        result.put("content", responses);
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }

    public InsuranceContractResponse mapRowToResponse(Object[] row) {
        InsuranceContractResponse res = new InsuranceContractResponse();

        // Contract fields (0–6)
        res.setCoverageMoney((BigDecimal) row[0]);
        res.setCreateAt(row[1] != null ? ((Date) row[1]).toLocalDate() : null);
        res.setExpiredDate(row[2] != null ? ((Date) row[2]).toLocalDate() : null);
        res.setFee((BigDecimal) row[3]);
        res.setContractId((Long) row[4]);
        res.setInsuranceId(row[5] != null ? ((Number) row[5]).longValue() : null);
        res.setOrderProductSerialId(row[6] != null ? ((Number) row[6]).longValue() : null);
        res.setContractStatus((String) row[7]);

        // Insurance fields (7–14)
        InsuranceResponse insurance = new InsuranceResponse();
        insurance.setName((String) row[8]);
        res.setCode((String) row[9]);
        insurance.setReleaseAt(row[10] != null ? ((Date) row[10]).toLocalDate() : null);
        insurance.setInsured(row[11] != null ? ((Number) row[11]).intValue() : 0);
        insurance.setTerms((String) row[12]);
        insurance.setStatus(row[13] != null ? InsuranceStatus.valueOf((String) row[13]) : null);
        insurance.setCoverageMoney((BigDecimal) row[14]);
        insurance.setProvider((String) row[15]);
        insurance.setFee((BigDecimal) row[16]);

        // Optional: serial number from product_serial (15)
        // Nếu bạn muốn thêm field này vào InsuranceResponse thì cần sửa DTO
        // insurance.setSerialNumber((String) row[15]); // Nếu DTO có

        res.setInsuranceResponse(insurance);

        // User fields (16–21)
        UserResponse user = new UserResponse();
        user.setFirstName((String) row[18]);
        user.setLastName((String) row[19]);
        user.setBday(row[20] != null ? ((Date) row[20]).toLocalDate() : null);
        user.setAddress((String) row[21]);
        user.setEmail((String) row[22]);
        user.setPhone((String) row[23]);

        res.setUserResponse(user);

        return res;
    }




    public List<InsurancePending> createInsurancePendings(List<InsurancePendingRequest> requests, Long orderId){
        List<InsurancePending> pendings = new ArrayList<>();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        for (InsurancePendingRequest request : requests) {
            Insurance insurance = insuranceRepository.findById(request.getInsuranceId())
                    .orElseThrow(() -> new RuntimeException("Insurance not found with id: " + request.getInsuranceId()));

            OrderProduct orderProduct = orderProductRepository.findById(request.getProductOptionId())
                    .orElseThrow(() -> new RuntimeException("OrderProduct not found with id: " + request.getProductOptionId()));

            InsurancePending pending = new InsurancePending();
            pending.setOrder(order);
            pending.setInsurance(insurance);
            pending.setOrderProduct(orderProduct);
            pending.setQuantity(request.getQuantity().intValue());
            pending.setStatus(PendingStatus.PENDING); // hoặc một giá trị mặc định khác
            pending.setUpdateAt(LocalDateTime.now());

            // Tính totalFee nếu có logic, ví dụ: fee = quantity * đơn giá bảo hiểm
            BigDecimal feePerUnit = insurance.getFee(); // giả sử trong entity Insurance có field fee
            pending.setTotalfee(feePerUnit.multiply(BigDecimal.valueOf(request.getQuantity())));

            pendings.add(pending);
        }

        return pendings;
    }





}
