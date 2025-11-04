import React from "react";
import "../App.css"; // fixed correct import

const AssessmentTable = () => {
  const areas = [
    "Target Achievement Consistency",
    "Processing Time Adherence",
    "Error Rate in Claims",
    "Performance During Peak Periods",
    "Training Participation and Skill Development",
    "Adherence to Compliance",
    "Team Collaboration",
  ];

  return (
    <div className="assessment-table">
      {/* ===== Employee Assessment Table ===== */}
      <h2>Employee Self Assessment</h2>
      <table>
        <thead>
          <tr>
            <th>Area of Assessment</th>
            <th>Employee Self Assessment</th>
            <th>Summarize Your Performance</th>
            <th>Significant Achievements</th>
            <th>Developments</th>
            <th>Training Requirements</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area, index) => (
            <tr key={index}>
              <td>{area}</td>
              <td><textarea /></td>
              <td><textarea /></td>
              <td><textarea /></td>
              <td><textarea /></td>
              <td><textarea /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="line"></div>

      {/* ===== Manager's Comments Table ===== */}
      <h2>Manager’s Comments</h2>
      <table>
        <thead>
          <tr>
            <th>Area of Assessment</th>
            <th>Manager assessment of employee</th>
            <th>Summarize employee's performance</th>
            <th>Significant Achievements</th>
            <th>Developments</th>
            <th>Training Requirements</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area, index) => (
            <tr key={index}>
              <td>{area}</td>
              <td><textarea /></td>
              <td><textarea/></td>
              <td><textarea /></td>
              <td><textarea /></td>
              <td><textarea /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentTable;
