package com.example.demo.repository.auth;

import com.example.demo.model.auth.ReceiverInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiverInfoRepository extends JpaRepository<ReceiverInfo, Long> {

    List<ReceiverInfo> findAllByUserId(Long userId);
}
