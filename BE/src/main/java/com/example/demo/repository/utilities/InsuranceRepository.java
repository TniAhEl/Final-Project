package com.example.demo.repository.utilities;

import com.example.demo.model.utilities.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    boolean existsByName(String name);

    boolean existsByProvider(String provider);
}
