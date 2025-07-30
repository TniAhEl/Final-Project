import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const jobs = [
  {
    title: "Frontend Developer",
    description:
      "Develop and maintain user-facing features for our e-commerce platform using ReactJS. Collaborate with UI/UX designers to deliver a seamless shopping experience.",
    requirements: [
      "Proficient in ReactJS, JavaScript, HTML, CSS",
      "Experience with RESTful APIs",
      "Familiarity with version control (Git)",
      "Good problem-solving skills",
      "Teamwork and communication skills",
    ],
    qualifications: [
      "Bachelor's degree in Computer Science, Information Technology or related field",
      "English reading comprehension",
      "Portfolio of previous web projects is a plus",
    ],
    benefits: [
      "Attractive salary and performance bonus",
      "Flexible working hours, hybrid/remote options",
      "Annual company trip, team building activities",
      "Health insurance and social insurance",
      "Modern working environment",
    ],
  },
  {
    title: "Backend Developer",
    description:
      "Design, develop, and maintain server-side logic, databases, and APIs for the e-commerce system. Ensure high performance and responsiveness to requests from the frontend.",
    requirements: [
      "Experience with Node.js/Java/Spring Boot or similar backend frameworks",
      "Knowledge of database systems (MySQL, MongoDB, etc.)",
      "Understanding of RESTful API design",
      "Basic knowledge of cloud services is a plus",
      "Ability to work independently and in a team",
    ],
    qualifications: [
      "Bachelor's degree in Computer Science, Software Engineering or related field",
      "Experience with distributed systems is a plus",
      "English communication skills",
    ],
    benefits: [
      "Competitive salary and project bonus",
      "Opportunities for professional growth",
      "Support for certifications and training",
      "Annual leave, sick leave, and holidays",
      "Dynamic and friendly team",
    ],
  },
  {
    title: "Customer Support",
    description:
      "Provide support and assistance to customers via phone, email, and chat. Resolve issues related to orders, payments, and product information.",
    requirements: [
      "Excellent communication and problem-solving skills",
      "Patient, enthusiastic, and customer-oriented",
      "Ability to work in shifts, including weekends",
      "Experience in customer service is an advantage",
      "Basic computer skills",
    ],
    qualifications: [
      "High school diploma or higher",
      "Fluent in Vietnamese, basic English is a plus",
      "Experience in a similar role is preferred",
    ],
    benefits: [
      "Monthly salary and performance incentives",
      "Comprehensive training program",
      "Friendly and supportive working environment",
      "Annual health check",
      "Employee discounts on products",
    ],
  },
];

const Jobs = () => {
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
            Careers & Job Opportunities
          </h1>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 32 }}>
            Join <b>Ecommerce</b> and be part of a dynamic, innovative, and passionate team! Explore our current job openings below and apply to become a member of our growing family.
          </p>

          {jobs.map((job, idx) => (
            <div key={job.title} style={{ marginBottom: 40, borderBottom: idx < jobs.length - 1 ? "1px solid #e5e7eb" : "none", paddingBottom: 32 }}>
              <h2 style={{ color: "#2563eb", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{job.title}</h2>
              <p style={{ color: "#64748b", marginBottom: 12 }}>{job.description}</p>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 style={{ fontWeight: 600, color: "#1976d2", marginBottom: 6 }}>Job Requirements</h3>
                  <ul style={{ color: "#64748b", paddingLeft: 20 }}>
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 style={{ fontWeight: 600, color: "#1976d2", marginBottom: 6 }}>Qualifications</h3>
                  <ul style={{ color: "#64748b", paddingLeft: 20 }}>
                    {job.qualifications.map((qual, i) => (
                      <li key={i}>{qual}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h3 style={{ fontWeight: 600, color: "#1976d2", marginBottom: 6 }}>Benefits</h3>
                  <ul style={{ color: "#64748b", paddingLeft: 20 }}>
                    {job.benefits.map((ben, i) => (
                      <li key={i}>{ben}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Apply section */}
          <div style={{ marginTop: 40, marginBottom: 0, textAlign: "center", color: "#374151" }}>
            <h2 style={{ color: "#1976d2", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>How to Apply</h2>
            <p style={{ marginBottom: 8 }}>
              Please send your CV and cover letter to:
              <br />
              <a href="mailto:hr@ecommerce.com" style={{ color: "#2563eb", fontWeight: 600 }}>hr@ecommerce.com</a>
            </p>
            <p style={{ marginBottom: 8 }}>
              Email subject: <b>Application - [Position] - [Your Name]</b>
            </p>
            <p style={{ marginBottom: 8 }}>
              For any questions, contact our HR hotline: <a href="tel:0123456789" style={{ color: "#2563eb" }}>0123 456 789</a>
            </p>
          </div>

          <div style={{ marginTop: 40, textAlign: "center", color: "#94a3b8" }}>
            &copy; {new Date().getFullYear()} Ecommerce. All rights reserved.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs; 