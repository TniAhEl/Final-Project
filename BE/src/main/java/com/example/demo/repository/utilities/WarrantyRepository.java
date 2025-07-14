package com.example.demo.repository.utilities;

import com.example.demo.model.utilities.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    boolean existsByName(String name);
}
