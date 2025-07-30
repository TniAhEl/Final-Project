import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div
        style={{ background: "#f4f6f8", minHeight: "100vh", padding: "40px 0" }}
      >
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
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#1976d2",
              marginBottom: 16,
            }}
          >
            About Us
          </h1>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 32 }}>
            Welcome to <b>Ecommerce</b>!
We are a team of young, dynamic professionals passionate about technology and e-commerce.
Our mission is to deliver the most seamless, secure, and convenient online shopping experience for our customers.
          </p>

          {/* History */}
          <section style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              History
            </h2>
            <p style={{ color: "#64748b" }}>
              Established in 2024, Ecommerce has continuously developed and
              innovated to meet the ever-increasing demands of customers. From a
              small group of technology enthusiasts, we have built a modern e-commerce
              platform serving thousands of customers nationwide.
            </p>
          </section>

          {/* Founding Team */}
          <section style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              Founding Team
            </h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Founder 1"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontWeight: 600 }}>Nguyễn Văn A</div>
                <div style={{ color: "#64748b" }}>CEO & Co-Founder</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Founder 2"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontWeight: 600 }}>Trần Thị B</div>
                <div style={{ color: "#64748b" }}>CTO & Co-Founder</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img
                  src="https://randomuser.me/api/portraits/men/65.jpg"
                  alt="Founder 3"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    marginBottom: 8,
                  }}
                />
                <div style={{ fontWeight: 600 }}>Lê Văn C</div>
                <div style={{ color: "#64748b" }}>COO & Co-Founder</div>
              </div>
            </div>
          </section>

          {/* Vision, Core Values, Contact */}
          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>
                Vision 
              </h2>
              <p style={{ color: "#64748b" }}>
                To become the leading e-commerce platform where everyone can
                easily, transparently, and efficiently buy and sell goods.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>
                Core Values
              </h2>
              <ul style={{ color: "#64748b", paddingLeft: 20 }}>
                <li>Customer-Centric</li>
                <li>Innovation</li>
                <li>Integrity & Transparency</li>
                <li>Collaboration & Development</li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>
                Contact
              </h2>
              <p style={{ color: "#64748b" }}>
                Email:{" "}
                <a
                  href="mailto:support@ecommerce.com"
                  style={{ color: "#1976d2" }}
                >
                  support@ecommerce.com
                </a>
                <br />
                Hotline: <b>0123 456 789</b>
              </p>
            </div>
          </div>

          {/* Commitment to Customers */}
          <section style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 8,
              }}
            >
              Commitment to Customers
            </h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Fast and on-time delivery</li>
              <li>24/7 customer support</li>
              <li>Absolute information security</li>
              <li>Flexible return policy</li>
            </ul>
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

export default AboutUs;
