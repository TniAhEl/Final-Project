package com.example.demo.service.utility;


import com.example.demo.model.order.OrderProduct;
import com.example.demo.model.product.Product;
import com.example.demo.repository.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderEmail(String to, String customerName, String orderCode, List<OrderProduct> products, BigDecimal totalAmount) {
        StringBuilder productDetails = new StringBuilder();

        for (OrderProduct orderProduct : products) {
            String productName = orderProduct.getProductOption().getProduct().getName(); // Lấy tên sản phẩm
            int quantity = orderProduct.getQuantity();
            BigDecimal price = orderProduct.getUnitPrice();

            productDetails.append(String.format("- %s | SL: %d | Giá: %,.0f₫%n",
                    productName, quantity, price));
        }

        String subject = "Xác nhận đơn hàng #" + orderCode;

        String content = String.format("""
        Xin chào %s,

        Cảm ơn bạn đã đặt hàng tại hệ thống của chúng tôi.
        Chúng tôi xin xác nhận đơn hàng.
        Mã đơn hàng của bạn là: %s

        Thông tin sản phẩm:
        %s
        --------------------------
        Tổng tiền: %,.0f₫

        Chúng tôi sẽ liên hệ với bạn để giao hàng sớm nhất.

        Trân trọng,
        Hệ thống bán hàng.
        """,
                customerName, orderCode, productDetails.toString(), totalAmount
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        message.setFrom("haletintoa7@gmail.com"); // địa chỉ email gửi

        mailSender.send(message);
    }

    public void sendOrderSummaryEmail(String to, String customerName, String orderCode, List<OrderProduct> products, BigDecimal totalAmount) {
        String subject = "Xác nhận đơn hàng #" + orderCode;

        StringBuilder content = new StringBuilder();
        content.append(String.format("""
        Xin chào %s,

        Cảm ơn bạn đã đặt hàng tại hệ thống của chúng tôi.
        Dưới đây là tóm tắt đơn hàng của bạn:

        """, customerName));

        // Tóm tắt sản phẩm
        for (OrderProduct orderProduct : products) {
            String productName = orderProduct.getProductOption().getProduct().getName();
            int quantity = orderProduct.getQuantity();
            BigDecimal price = orderProduct.getUnitPrice();

            content.append(String.format("- %s x%d: %,.0f₫%n", productName, quantity, price));
        }

        content.append("--------------------------\n");
        content.append(String.format("Tổng tiền: %,.0f₫%n%n", totalAmount));
        content.append("Chúng tôi sẽ liên hệ với bạn để xác nhận và giao hàng trong thời gian sớm nhất.\n\nTrân trọng,\nHệ thống bán hàng.");

        // Gửi mail
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content.toString());
        message.setFrom("haletintoa7@gmail.com"); // Gmail đã cấu hình

        mailSender.send(message);
    }



    public void sendTestEmail() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("hltin-batch19bd@sdc.edu.vn");
        message.setSubject("Test Email");
        message.setText("Hello, this is a test email from Spring Boot.");
        mailSender.send(message);
    }

}
