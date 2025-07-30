package com.example.demo.service.impl.auth;

import com.example.demo.dto.request.MonthlyReportsFilter;
import com.example.demo.enums.CustomerStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.UserMonthlyReports;
import com.example.demo.model.auth.User;
import com.example.demo.repository.UserMonthlyReportsRepository;
import com.example.demo.repository.auth.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserReportsService implements IUserReportsService{
    private final UserRepository userRepository;
    private final UserMonthlyReportsRepository userMonthlyReportsRepository;
    private final EntityManager entityManager;


    @Override
    public Map<String, Object> FilterMonthlyReport(MonthlyReportsFilter filter, Long userId, int page, int size) {
        String baseSql = """
        SELECT 
            crm.* 
        FROM monthly_reports crm
        WHERE 1=1
    """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (userId != null) {
            where.append(" AND crm.user_id = :userId");
            params.put("userId", userId);
        }

        if (filter.getYear() > 0) {
            where.append(" AND crm.year = :year");
            params.put("year", filter.getYear());
        }

        String finalSql = baseSql + where.toString() + " ORDER BY crm.month DESC";

        Query query = entityManager.createNativeQuery(finalSql, UserMonthlyReports.class); // Đảm bảo MonthlyReport là entity

        // Set parameter values
        params.forEach(query::setParameter);

        // Paging
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        // Execute query
        List<UserMonthlyReports> results = query.getResultList();

        // Count query for total elements
        String countSql = "SELECT COUNT(*) FROM monthly_reports crm WHERE 1=1" + where.toString();
        Query countQuery = entityManager.createNativeQuery(countSql);
        params.forEach(countQuery::setParameter);
        long totalElements = ((Number) countQuery.getSingleResult()).longValue();

        return Map.of(
                "data", results,
                "currentPage", page,
                "pageSize", size,
                "totalElements", totalElements,
                "totalPages", (int) Math.ceil((double) totalElements / size)
        );
    }


    @Override
    @Transactional
    public UserMonthlyReports summaryReport(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        // Kiểm tra đã có báo cáo tháng này chưa
        Optional<UserMonthlyReports> optionalReport = userMonthlyReportsRepository
                .findByUserIdAndMonthAndYear(userId, month, year);

        UserMonthlyReports report = optionalReport.orElseGet(() -> {
            UserMonthlyReports newReport = new UserMonthlyReports();
            newReport.setUser(user);
            newReport.setMonth(month);
            newReport.setYear(year);
            return userMonthlyReportsRepository.save(newReport);
        });

        // Tính khoảng thời gian của tháng hiện tại
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = startDate.plusMonths(1);

        // Thực hiện native SQL
        Object[] result = (Object[]) entityManager.createNativeQuery("""
        SELECT 
            COUNT(DISTINCT o.id), 
            SUM(o.total_money), 
            SUM(CASE WHEN o.order_status = 'CONFIRM' THEN 1 ELSE 0 END),
            SUM(CASE WHEN o.order_status = 'PENDING' THEN 1 ELSE 0 END),
            COUNT(DISTINCT r.id),
            SUM(CASE WHEN o.order_status = 'CONFIRM' THEN op.quantity ELSE 0 END)
        FROM order_table o
        LEFT JOIN product_review r ON r.user_id = o.user_id
        JOIN order_product op ON op.order_id = o.id
        WHERE o.user_id = :userId AND o.update_at >= :startDate AND o.update_at < :endDate
    """)
                .setParameter("userId", userId)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getSingleResult();

        // Mapping kết quả
        Long totalOrders = ((Number) result[0]).longValue();
        BigDecimal totalMoney = result[1] != null ? (BigDecimal) result[1] : BigDecimal.ZERO;
        Long confirmedOrders = ((Number) result[2]).longValue();
        Long pendingOrders = ((Number) result[3]).longValue();
        Long totalReviews = ((Number) result[4]).longValue();
        Long totalConfirmedQuantity = ((Number) result[5]).longValue();

        // Cập nhật vào report
        report.setTotalOrders(totalOrders);
        report.setTotalSpendMoney(totalMoney);
        report.setTotalConfirmOrders(confirmedOrders);
        report.setTotalPendingOrders(pendingOrders);
        report.setTotalReview(totalReviews);
        report.setTotalProducts(totalConfirmedQuantity);

        // Lưu lại report
        return userMonthlyReportsRepository.save(report);
    }

    @Override
    @Transactional
    public UserMonthlyReports AdminSummaryReport() {
        final String SYSTEM_ADMIN_EMAIL = "admin@system.local";

        // Tìm hoặc tạo User "giả" cho admin báo cáo
        User adminUser = userRepository.findByEmail(SYSTEM_ADMIN_EMAIL)
                .orElseGet(() -> {
                    User dummy = new User();
                    dummy.setUsername("system_admin");
                    dummy.setEmail(SYSTEM_ADMIN_EMAIL);
                    dummy.setFirstName("System");
                    dummy.setLastName("Admin");
                    dummy.setPhone("0000000000");
                    dummy.setPassword("!"); // không dùng đăng nhập
                    dummy.setStatus(CustomerStatus.ACTIVE);
                    return userRepository.save(dummy);
                });

        Long adminUserId = adminUser.getId(); // <-- ID này được sinh hợp lệ

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Optional<UserMonthlyReports> optionalReport = userMonthlyReportsRepository
                .findByUserIdAndMonthAndYear(adminUserId, month, year);

        UserMonthlyReports report = optionalReport.orElseGet(() -> {
            UserMonthlyReports newReport = new UserMonthlyReports();
            newReport.setUser(adminUser);
            newReport.setMonth(month);
            newReport.setYear(year);
            return userMonthlyReportsRepository.save(newReport);
        });

        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = startDate.plusMonths(1);

        Object[] result = (Object[]) entityManager.createNativeQuery("""
        SELECT 
            COUNT(DISTINCT o.id), 
            SUM(o.total_money), 
            SUM(CASE WHEN o.order_status = 'CONFIRM' THEN 1 ELSE 0 END),
            SUM(CASE WHEN o.order_status = 'PENDING' THEN 1 ELSE 0 END),
            COUNT(DISTINCT r.id),
            SUM(CASE WHEN o.order_status = 'CONFIRM' THEN op.quantity ELSE 0 END)
        FROM order_table o
        LEFT JOIN product_review r ON r.user_id = o.user_id
        JOIN order_product op ON op.order_id = o.id
        WHERE o.update_at >= :startDate AND o.update_at < :endDate
    """)
                .setParameter("startDate", startDate)
                .setParameter("endDate", endDate)
                .getSingleResult();

        // Mapping kết quả
        Long totalOrders = ((Number) result[0]).longValue();
        BigDecimal totalMoney = result[1] != null ? (BigDecimal) result[1] : BigDecimal.ZERO;
        Long confirmedOrders = ((Number) result[2]).longValue();
        Long pendingOrders = ((Number) result[3]).longValue();
        Long totalReviews = ((Number) result[4]).longValue();
        Long totalConfirmedQuantity = ((Number) result[5]).longValue();

        report.setTotalOrders(totalOrders);
        report.setTotalSpendMoney(totalMoney);
        report.setTotalConfirmOrders(confirmedOrders);
        report.setTotalPendingOrders(pendingOrders);
        report.setTotalReview(totalReviews);
        report.setTotalProducts(totalConfirmedQuantity);

        return userMonthlyReportsRepository.save(report);
    }

    @Override
    public Map<String, Object> adminFilterMonthlyReport(MonthlyReportsFilter filter, int page, int size) {
        // Tìm ID của user giả cho admin
        final String SYSTEM_ADMIN_EMAIL = "admin@system.local";
        Optional<User> adminOpt = userRepository.findByEmail(SYSTEM_ADMIN_EMAIL);
        if (adminOpt.isEmpty()) {
            return Map.of(
                    "data", List.of(),
                    "currentPage", page,
                    "pageSize", size,
                    "totalElements", 0,
                    "totalPages", 0
            );
        }

        Long adminUserId = adminOpt.get().getId();

        String baseSql = """
        SELECT 
            crm.* 
        FROM monthly_reports crm
        WHERE crm.user_id = :adminUserId
    """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();
        params.put("adminUserId", adminUserId);

        if (filter.getYear() > 0) {
            where.append(" AND crm.year = :year");
            params.put("year", filter.getYear());
        }

        String finalSql = baseSql + where.toString() + " ORDER BY crm.year DESC, crm.month DESC";

        Query query = entityManager.createNativeQuery(finalSql, UserMonthlyReports.class);
        params.forEach(query::setParameter);

        // Paging
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        List<UserMonthlyReports> results = query.getResultList();

        // Count query
        String countSql = "SELECT COUNT(*) FROM monthly_reports crm WHERE crm.user_id = :adminUserId" + where.toString();
        Query countQuery = entityManager.createNativeQuery(countSql);
        params.forEach(countQuery::setParameter);
        long totalElements = ((Number) countQuery.getSingleResult()).longValue();

        return Map.of(
                "data", results,
                "currentPage", page,
                "pageSize", size,
                "totalElements", totalElements,
                "totalPages", (int) Math.ceil((double) totalElements / size)
        );
    }



}
