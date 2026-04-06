import React, { useState, useEffect } from "react";

type Job = {
  id: number;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [filter, setFilter] = useState<
    "All" | "Applied" | "Interview" | "Rejected" | "Offer"
  >("All");

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!company.trim() || !role.trim()) return;

    const newJob: Job = {
      id: Date.now(),
      company,
      role,
      status: "Applied",
    };

    setJobs([newJob, ...jobs]);
    setCompany("");
    setRole("");
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const changeStatus = (id: number, status: Job["status"]) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status } : job)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "#3b82f6";
      case "Interview":
        return "#f59e0b";
      case "Offer":
        return "#10b981";
      case "Rejected":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  // 🔥 FILTER LOGIC
  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "sans-serif",
        padding: 20,
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>
          🚀 Job Application Tracker
        </h1>

        {/* Input */}
        <div
          style={{
            background: "#1e293b",
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          />
          <button onClick={addJob} style={addBtn}>
            Add
          </button>
        </div>

        {/* 🔥 FILTER BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["All", "Applied", "Interview", "Offer", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: filter === f ? "#22c55e" : "#1e293b",
                color: "white",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filteredJobs.length === 0 && (
          <p style={{ opacity: 0.6 }}>No applications 👀</p>
        )}

        {/* Jobs */}
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: "#1e293b",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: "bold" }}>
              {job.company}
            </div>
            <div style={{ opacity: 0.7 }}>{job.role}</div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <select
                value={job.status}
                onChange={(e) =>
                  changeStatus(job.id, e.target.value as Job["status"])
                }
                style={{
                  ...inputStyle,
                  background: getStatusColor(job.status),
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <button onClick={() => deleteJob(job.id)} style={deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "none",
  outline: "none",
};

const addBtn: React.CSSProperties = {
  background: "#22c55e",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  color: "white",
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  background: "#ef4444",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  color: "white",
  cursor: "pointer",
};
