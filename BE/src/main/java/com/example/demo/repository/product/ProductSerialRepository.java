package com.example.demo.repository.product;

import com.example.demo.enums.ProductSerialStatus;
import com.example.demo.model.product.ProductSerial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSerialRepository extends JpaRepository<ProductSerial, Long> {

    boolean existsBySerialNumber(String serialNumber);

    Page<ProductSerial> findAllByProductOption_Id(Long optionId, Pageable pageable);


    List<ProductSerial> findAllByProductListConfigStatusAndProductOption_Id(
            ProductSerialStatus status,
            Long productOptionId
    );
}
