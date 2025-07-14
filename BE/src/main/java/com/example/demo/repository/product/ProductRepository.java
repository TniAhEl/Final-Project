package com.example.demo.repository.product;

import com.example.demo.model.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(String name);


    Page<Product> findAll(Pageable pageable);

    @Query("SELECT DISTINCT p.brand FROM Product p")
    List<String> findAllDistinctBrands();
}
