package com.example.demo.repository.product;

import com.example.demo.model.product.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    boolean existsByName(String name);

    boolean existsByLocation(String location);

    @Query("SELECT s FROM Store s JOIN s.products p WHERE p.id = :productId")
    List<Store> findAllByProductId(@Param("productId") Long productId);
}
