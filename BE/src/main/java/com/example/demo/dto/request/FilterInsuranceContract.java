package com.example.demo.dto.request;

import com.example.demo.enums.ContractStatus;
import lombok.Data;

@Data
public class FilterInsuranceContract {
    private Long userId;
    private String contractName;
    private ContractStatus status;
}
