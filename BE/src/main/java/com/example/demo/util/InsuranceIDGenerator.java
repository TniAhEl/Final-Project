package com.example.demo.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class InsuranceIDGenerator {
    private static final String PREFIX = "ICI";
    private static final DateTimeFormatter DATE_FORMATTER =DateTimeFormatter.ofPattern("ddMMyyyy");
    private static final Map<String, AtomicInteger> counterMap = new ConcurrentHashMap<>();

    public static synchronized  String generate(String insuranceName, LocalDate confirmDate){
        String datePart = confirmDate.format(DATE_FORMATTER);
        String insuranceCode = extractInsuranceName(insuranceName);
        String counterKey = datePart ;
        int current = counterMap.computeIfAbsent(counterKey, k -> new AtomicInteger(0)).getAndIncrement();
        String increment = String.format("%05d", current);
        return PREFIX + insuranceCode + datePart +increment;
    }

    private static String extractInsuranceName(String insuranceName) {
        if (insuranceName == null || !insuranceName.contains(",")) return "XX";
        String[] parts = insuranceName.split(",");
        String lastPart = parts[parts.length - 1].trim();
        StringBuilder code = new StringBuilder();
        for (String word : lastPart.split("\\s+")) {
            if (!word.isEmpty()) code.append(Character.toUpperCase(word.charAt(0)));
        }
        return code.toString();
    }




}
