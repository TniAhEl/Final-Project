package com.example.demo.repository;

import com.example.demo.model.utilities.InsuranceContract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceContractRepository extends JpaRepository<InsuranceContract, Long> {
}