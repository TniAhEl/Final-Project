import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const AboutUs = () => {
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
            Về Chúng Tôi
          </h1>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 32 }}>
            Chào mừng bạn đến với <b>Ecommerce</b>! Chúng tôi là đội ngũ trẻ trung, năng động, đam mê công nghệ và thương mại điện tử. Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm trực tuyến dễ dàng, an toàn và tiện lợi nhất cho khách hàng.
          </p>

          {/* Lịch sử phát triển */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Lịch sử phát triển</h2>
            <p style={{ color: "#64748b" }}>
              Được thành lập từ năm 2024, Ecommerce đã không ngừng phát triển và đổi mới để đáp ứng nhu cầu ngày càng cao của khách hàng. Từ một nhóm nhỏ đam mê công nghệ, chúng tôi đã xây dựng nên một nền tảng thương mại điện tử hiện đại, phục vụ hàng ngàn khách hàng trên toàn quốc.
            </p>
          </section>

          {/* Đội ngũ sáng lập */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Đội ngũ sáng lập</h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder 1" style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>Nguyễn Văn A</div>
                <div style={{ color: "#64748b" }}>CEO & Co-Founder</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Founder 2" style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>Trần Thị B</div>
                <div style={{ color: "#64748b" }}>CTO & Co-Founder</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "center" }}>
                <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Founder 3" style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>Lê Văn C</div>
                <div style={{ color: "#64748b" }}>COO & Co-Founder</div>
              </div>
            </div>
          </section>

          {/* Tầm nhìn, Giá trị cốt lõi, Liên hệ */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>Tầm nhìn</h2>
              <p style={{ color: "#64748b" }}>
                Trở thành nền tảng thương mại điện tử hàng đầu, nơi mọi người đều có thể mua sắm và bán hàng một cách dễ dàng, minh bạch và hiệu quả.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>Giá trị cốt lõi</h2>
              <ul style={{ color: "#64748b", paddingLeft: 20 }}>
                <li>Khách hàng là trung tâm</li>
                <li>Đổi mới sáng tạo</li>
                <li>Chính trực & Minh bạch</li>
                <li>Hợp tác & Phát triển</li>
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 250 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22 }}>Liên hệ</h2>
              <p style={{ color: "#64748b" }}>
                Email: <a href="mailto:support@ecommerce.com" style={{ color: "#1976d2" }}>support@ecommerce.com</a><br />
                Hotline: <b>0123 456 789</b>
              </p>
            </div>
          </div>

          {/* Cam kết với khách hàng */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Cam kết với khách hàng</h2>
            <ul style={{ color: "#64748b", paddingLeft: 20 }}>
              <li>Giao hàng nhanh chóng, đúng hẹn</li>
              <li>Hỗ trợ khách hàng 24/7</li>
              <li>Bảo mật thông tin tuyệt đối</li>
              <li>Chính sách đổi trả linh hoạt</li>
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
