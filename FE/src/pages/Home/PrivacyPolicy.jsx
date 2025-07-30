import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div style={{ background: "#f4f6f8", minHeight: "100vh", padding: "40px 0" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            padding: 40,
          }}
        >
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1976d2", marginBottom: 16 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 32 }}>
            At <b>Ecommerce</b>, we are committed to protecting your privacy and ensuring the security of your personal information when you shop on our platform. Please read our privacy policy below to understand how we collect, use, and safeguard your data.
          </p>

          {/* Introduction */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              Introduction
            </h2>
            <p style={{ color: "#64748b" }}>
              This Privacy Policy explains how Ecommerce collects, uses, discloses, and protects your personal information when you use our website, mobile app, and related services. By using our services, you agree to the terms of this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              Information We Collect
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Personal details (name, email, phone number, address, date of birth, etc.)</li>
              <li>Account credentials and login information</li>
              <li>Order and transaction history</li>
              <li>Payment information (secured and encrypted)</li>
              <li>Device and usage data (IP address, browser, device type, etc.)</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              How We Use Your Information
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>To process orders and deliver products/services</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To personalize your shopping experience</li>
              <li>To improve our platform, products, and services</li>
              <li>To send important notifications, promotions, and updates (with your consent)</li>
              <li>To comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              Data Security
            </h2>
            <p style={{ color: "#64748b" }}>
              We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted and processed securely. We regularly review and update our security practices.
            </p>
          </section>

          {/* Your Rights */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              Your Rights
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Access and review your personal information</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Contact us for any privacy-related concerns</li>
            </ul>
          </section>

          {/* Contact */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              Contact Us
            </h2>
            <p style={{ color: "#64748b" }}>
              If you have any questions or requests regarding your privacy or our policy, please contact us at:
              <br />
              Email: <a href="mailto:support@ecommerce.com" style={{ color: "#1976d2" }}>support@ecommerce.com</a>
              <br />
              Hotline: <a href="tel:0123456789" style={{ color: "#1976d2" }}>0123 456 789</a>
            </p>
          </section>

          <div style={{ marginTop: 40, textAlign: "center", color: "#94a3b8" }}>
            &copy; {new Date().getFullYear()} Ecommerce. All rights reserved.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy; 