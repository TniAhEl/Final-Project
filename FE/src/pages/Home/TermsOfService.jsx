import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 32 }}>
            Please read these Terms of Service ("Terms") carefully before using the Ecommerce platform. By accessing or using our website, mobile app, or services, you agree to be bound by these Terms.
          </p>

          {/* General Terms */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              1. General Terms
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>These Terms apply to all users of the Ecommerce platform.</li>
              <li>We may update or modify these Terms at any time. Continued use of the service constitutes acceptance of the new Terms.</li>
              <li>Users must be at least 18 years old or have legal guardian consent to use our services.</li>
            </ul>
          </section>

          {/* User Rights and Responsibilities */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              2. User Rights and Responsibilities
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Provide accurate, up-to-date information when registering and using the platform.</li>
              <li>Maintain the confidentiality of your account and password.</li>
              <li>Comply with all applicable laws and regulations.</li>
              <li>Do not use the platform for fraudulent, illegal, or harmful activities.</li>
              <li>Respect the rights and privacy of other users.</li>
            </ul>
          </section>

          {/* Platform Rights and Responsibilities */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              3. Platform Rights and Responsibilities
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Provide a secure and reliable e-commerce platform for users.</li>
              <li>Protect user data in accordance with our Privacy Policy.</li>
              <li>Monitor and remove content that violates these Terms or applicable laws.</li>
              <li>Temporarily or permanently suspend accounts that violate the Terms.</li>
              <li>Update, modify, or discontinue any part of the service at any time.</li>
            </ul>
          </section>

          {/* Payment Policy */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              4. Payment Policy
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>All payments must be made through the methods provided on the platform.</li>
              <li>Users are responsible for providing accurate payment information.</li>
              <li>Refunds and returns are subject to our Return & Refund Policy.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              5. Limitation of Liability
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Ecommerce is not liable for any indirect, incidental, or consequential damages arising from the use of the platform.</li>
              <li>We do not guarantee the accuracy, completeness, or reliability of any content or product on the platform.</li>
              <li>Users are responsible for their own actions and interactions on the platform.</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              6. Changes to Terms
            </h2>
            <p style={{ color: "#64748b" }}>
              We reserve the right to update or modify these Terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
              7. Contact
            </h2>
            <p style={{ color: "#64748b" }}>
              If you have any questions about these Terms, please contact us at:
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

export default TermsOfService; 