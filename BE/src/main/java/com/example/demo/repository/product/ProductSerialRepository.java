package com.example.demo.repository.product;

import com.example.demo.enums.ProductSerialStatus;
import com.example.demo.model.product.ProductSerial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSerialRepository extends JpaRepository<ProductSerial, Long> {

    boolean existsBySerialNumber(String serialNumber);

    List<ProductSerial> findAllByProductOption_Id(Long optionId);

    List<ProductSerial> findAllByProductListConfigStatusAndProductOption_Id(
            ProductSerialStatus status,
            Long productOptionId
    );
}
