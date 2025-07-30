package com.example.demo.repository.auth;

import com.example.demo.model.UserMonthlyReports;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReportsRepository extends JpaRepository<UserMonthlyReports, Long> {
}
