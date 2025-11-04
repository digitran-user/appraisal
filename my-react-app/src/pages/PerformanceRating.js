import React from "react";

const PerformanceRating = () => {
  const competencies = ["Customer Service", "Innovation", "Teamwork", "Quality", "Communication"];
    const competencyLevel = [
    "Accountability",
    "Adaptability",
    "Quality Focus",
    "Inclusiveness",
    "Team Focus",
    "Technology Orientation",
  ];
  const kpiWeighting = "100% distribution as per grade level objectives.";

  const ratings = [
    { rating: 5, value: "Top Performer", description: "The employee has significantly exceeded expectations and is performing well above their current position." },
    { rating: 4, value: "Exceeds Expectations", description: "The employee has performed above average and stretched themselves to acheive positive feedbacks and ratings." },
    { rating: 3, value: "Meet Expectations", description: "The employee has performed on par with their collegues, and as per the expectations for their role/position." },
    { rating: 2, value: "Needs Improvement", description: "The employee has performed below average. Focus should be on identying measures to improve performance." },
    { rating: 1, value: "Significantly Underperforms", description: "The employee has significantly underperformed, and a performance improvement plan should be implemented immediately." },
  ];

  return (
    <div style={{ margin: "20px 0", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "15px" }}>Performance Rating</h2>

      {/* Simplified Info Row */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
          backgroundColor: "#fafafa",
          marginBottom: "20px",
          lineHeight: "1.8",
        }}
      >
        <p>
          <strong>Company Competencies:</strong>{" "}
          {competencies.join(", ")}
        </p>
        <p>
          <strong>Competency Level:</strong> {" "}
          {competencyLevel.join(", ")}
        </p>
        
        <p>
          <strong>KPI Weighting:</strong> {kpiWeighting}
        </p>
      </div>

      {/* Ratings Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Rating</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Value</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.rating}>
                <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
                  {r.rating}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
                  {r.value}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceRating;
