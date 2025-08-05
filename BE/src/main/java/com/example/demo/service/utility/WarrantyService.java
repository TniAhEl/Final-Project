package com.example.demo.service.utility;

import com.example.demo.dto.request.FilterWarrantyRequest;
import com.example.demo.dto.request.utilities.CreateWarrantyRequest;
import com.example.demo.dto.request.utilities.UpdateWarrantyRequest;
import com.example.demo.dto.response.CustomerWarrantyResponse;
import com.example.demo.dto.response.product.CustomerProductOption;
import com.example.demo.dto.response.utility.InsuranceContractResponse;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.enums.ColorName;
import com.example.demo.enums.WarrantyStatus;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Warranty;
import com.example.demo.repository.utilities.WarrantyRepository;
import com.example.demo.service.impl.utility.IWarrantyService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarrantyService implements IWarrantyService {
    private final WarrantyRepository warrantyRepository;
    private final ModelMapper modelMapper;
    private final EntityManager entityManager;

    @Override
    public List<Warranty> getAllWarranty() {
        return warrantyRepository.findAll();
    }

    @Override
    public Warranty getWarrantyById(Long id) {
        return warrantyRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Warranty not found!"));
    }

    @Override
    public Warranty createWarranty(CreateWarrantyRequest request) {
        if (warrantyRepository.existsByName(request.getName())) {
            throw new AlreadyExistsException("Warranty already exist");
        }
        Warranty warranty = new Warranty();
        warranty.setName(request.getName());
        warranty.setCondition(request.getCondition());
        warranty.setDuration(request.getDuration());
        warranty.setException(request.getException());
        warranty.setCreateAt(LocalDateTime.now());
        warranty.setUpdateAt(LocalDateTime.now());
        warranty.setNote(request.getNote());

        return warrantyRepository.save(warranty);
    }

    @Override
    @Transactional
    public Warranty updateWarranty(UpdateWarrantyRequest request, Long id) {
        Warranty existingWarranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warranty not found"));
        existingWarranty.setName(request.getName());
        existingWarranty.setNote(request.getNote());
        existingWarranty.setDuration(request.getDuration());
        existingWarranty.setCondition(request.getCondition());
        existingWarranty.setException(request.getException());
        existingWarranty.setUpdateAt(LocalDateTime.now());
        existingWarranty.setNote(request.getNote());
        return warrantyRepository.save(existingWarranty);
    }

    @Override
    @Transactional
    public void deleteWarranty(Long id) {
        warrantyRepository.findById(id)
                .ifPresentOrElse(warrantyRepository::delete, () -> {
                    throw new ResourceNotFoundException("warranty not found!");
                });
    }

    @Override
    public WarrantyResponse convertToResponse(Warranty warranty) {
        return modelMapper.map(warranty, WarrantyResponse.class);
    }

    @Override
    public Map<String, Object> filterCustomerWarranty(FilterWarrantyRequest filter, int page, int size) {
        String basisSql = """
                select 
                wc.id, wc.start_date, wc.end_date, wc.status,
                ps.serial_number,
                po.color_name, po.price, po.ram, po.rom, 
                p.name,
                wp.*
                from warranty_card wc
                join product_serial ps on ps.id = wc.product_serial_id
                join product_option po on po.id = ps.product_option_id
                join product p on p.id = po.product_id
                join order_table o on o.id = wc.order_id
                join warranty_policy wp on wp.id = p.warranty_id
                where 1=1
                """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();


        if (filter.getUserId() != null) {
            where.append(" AND o.user_id = :userId");
            params.put("userId", filter.getUserId());
        }

        if (filter.getStatus() != null) {
            where.append(" AND wc.status = :status");
            params.put("status", filter.getStatus());
        }

        String orderBy = " ORDER BY wc.id ASC";
        String limitOffset = " LIMIT :limit OFFSET :offset";

        String finalSql = basisSql + where + orderBy + limitOffset;
        String countSql = """
                select count(*)
                from warranty_card wc
                join product_serial ps on ps.id = wc.product_serial_id
                join product_option po on po.id = ps.product_option_id
                join product p on p.id = po.product_id
                join order_table o on o.id = wc.order_id
                join warranty_policy wp on wp.id = p.warranty_id
                where 1=1
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
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        List<CustomerWarrantyResponse> responses = rawResults.stream()
                .map(this::mapRowToResponse)
                .toList();


        Map<String, Object> result = new HashMap<>();
        result.put("content", responses);
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", (int) Math.ceil((double) total / size));

        return result;
    }

    public CustomerWarrantyResponse mapRowToResponse(Object[] row) {
        CustomerWarrantyResponse response = new CustomerWarrantyResponse();

        // Warranty Card (0–3)
        response.setWarrantyId(((Number) row[0]).longValue());
        response.setStartDate(row[1] != null ? ((Timestamp) row[1]).toLocalDateTime() : null);
        response.setEndDate(row[2] != null ? ((Timestamp) row[2]).toLocalDateTime() : null);

        response.setStatus(row[3] != null ? WarrantyStatus.valueOf(row[3].toString()) : null);

        // Serial (4)
        response.setSerialNumber((String) row[4]);

        // Product Option (5–9)
        CustomerProductOption option = new CustomerProductOption();
        option.setColorName(row[5] != null ? ColorName.valueOf(row[5].toString()) : null);
        option.setPrice((BigDecimal) row[6]);
        option.setRam(((Number) row[7]).intValue());
        option.setRom(((Number) row[8]).intValue());
        // remainingQuantity không có trong query → bạn cần thêm nếu cần gán
        response.setOptionResponse(option);

        // Product Name (10)
        response.setProductName((String) row[9]);

        // Warranty Policy (11–18)
        WarrantyResponse policy = new WarrantyResponse();
        policy.setId(((Long) row[10]));
        policy.setCondition((String) row[11]);
        policy.setCreateAt(row[12] != null ?
                (row[12] instanceof Timestamp ? ((Timestamp) row[12]).toLocalDateTime() : null)
                : null);
        policy.setDuration((Integer) row[13]);
        policy.setException((String) row[14]);
        policy.setName((String) row[15]);
        policy.setNote((String) row[16]);
        policy.setUpdateAt(row[17] != null ?
                (row[17] instanceof Timestamp ? ((Timestamp) row[17]).toLocalDateTime() : null)
                : null);

        response.setWarrantyPolicy(policy);

        return response;
    }


}
