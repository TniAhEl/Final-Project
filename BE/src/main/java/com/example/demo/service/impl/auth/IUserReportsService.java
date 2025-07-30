package com.example.demo.service.impl.auth;

import com.example.demo.dto.request.MonthlyReportsFilter;
import com.example.demo.model.UserMonthlyReports;

import java.util.Map;

public interface IUserReportsService {
    Map<String, Object> FilterMonthlyReport(MonthlyReportsFilter filter,Long userId, int page, int size);

    UserMonthlyReports summaryReport(Long userId);

    UserMonthlyReports AdminSummaryReport();

    Map<String, Object> adminFilterMonthlyReport(MonthlyReportsFilter filter, int page, int size);
}
