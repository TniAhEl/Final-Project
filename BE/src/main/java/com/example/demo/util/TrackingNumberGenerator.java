package com.example.demo.util;

import com.example.demo.enums.ShippingMethod;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class TrackingNumberGenerator {
    private static final String PREFIX = "TRK";
    private static final DateTimeFormatter DATE_FORMATTER =DateTimeFormatter.ofPattern("ddMMyyyy");
    private static final Map<String, AtomicInteger> counterMap = new ConcurrentHashMap<>();

    public static synchronized String generate(LocalDate confirmDate, String fullAddress, ShippingMethod method) {
        String datePart = confirmDate.format(DATE_FORMATTER);
        String addressCode = extractProvinceCode(fullAddress);
        String methodCode = extractMethodCode(method);
        String counterKey = datePart ;
        int current = counterMap.computeIfAbsent(counterKey, k -> new AtomicInteger(0)).getAndIncrement();
        String increment = String.format("%05d", current);
        return PREFIX + datePart + increment + addressCode + methodCode;
    }

    private static String extractProvinceCode(String fullAddress) {
        if (fullAddress == null || !fullAddress.contains(",")) return "XX";
        String[] parts = fullAddress.split(",");
        String lastPart = parts[parts.length - 1].trim();
        StringBuilder code = new StringBuilder();
        for (String word : lastPart.split("\\s+")) {
            if (!word.isEmpty()) code.append(Character.toUpperCase(word.charAt(0)));
        }
        return code.toString();
    }

    private static String extractMethodCode(ShippingMethod method) {
        return switch (method) {
            case FAST -> "F";
            case STANDARD -> "ST";
            case EXPRESS -> "EX";
            case PICKUP -> "PU";
            default -> "XX";
        };
    }
}