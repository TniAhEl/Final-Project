package com.example.demo.repository;

import com.example.demo.model.UserMonthlyReports;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserMonthlyReportsRepository extends JpaRepository<UserMonthlyReports, Long> {
    Optional<UserMonthlyReports> findByUserIdAndMonthAndYear(Long userId, int month, int year);
}