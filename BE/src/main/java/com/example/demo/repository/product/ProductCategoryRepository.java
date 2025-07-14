package com.example.demo.repository.product;

import com.example.demo.model.product.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    ProductCategory findByName(String name);

    boolean existsByName(String name);

}
