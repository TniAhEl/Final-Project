package com.example.demo.dto.request;

import com.example.demo.enums.WarrantyStatus;
import lombok.Data;

import java.util.List;

@Data
public class FilterOrderWarranty {
    private List<WarrantyStatus> statuses;
}
