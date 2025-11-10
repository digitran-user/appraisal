import React, { useEffect, useState } from "react";
import "../App.css";

const AssessmentTable = ({ grade, isManager, appraisal,savedAppraisal, setAppraisal }) => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/objectives/${grade}`);
        const data = await response.json();
        if (data && data.aoas) {
          setAreas(data.aoas.map(item => item.value));
        } else {
          setAreas([]);
        }
      } catch (error) {
        console.error("Error fetching AOAs:", error);
      }
    };

    if (grade) fetchAreas();
  }, [grade]);

  const handleChange = (index, field, value, type) => {
    setAppraisal(prev => {
      const updated = { ...prev };
      if (!updated[type]) updated[type] = [];
      updated[type][index] = {
        ...(updated[type][index] || {}),
        [field]: value
      };
      return updated;
    });
  };

  return (
    <div className="assessment-table">
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
              <td><textarea required disabled={isManager}
                value={savedAppraisal.self?.[index]?.assessment || ""}
                onChange={e => handleChange(index, "assessment", e.target.value, "self")}
              /></td>
              <td><textarea required disabled={isManager}
                value={savedAppraisal.self?.[index]?.performance || ""}
                onChange={e => handleChange(index, "performance", e.target.value, "self")}
              /></td>
              <td><textarea required disabled={isManager}
                value={savedAppraisal.self?.[index]?.achievements || ""}
                onChange={e => handleChange(index, "achievements", e.target.value, "self")}
              /></td>
              <td><textarea required disabled={isManager}
                value={savedAppraisal.self?.[index]?.developments || ""}
                onChange={e => handleChange(index, "developments", e.target.value, "self")}
              /></td>
              <td><textarea required disabled={isManager}
                value={savedAppraisal.self?.[index]?.training || ""}
                onChange={e => handleChange(index, "training", e.target.value, "self")}
              /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="line"></div>

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
              <td><textarea required disabled={!isManager}
                value={savedAppraisal.manager?.[index]?.assessment || ""}
                onChange={e => handleChange(index, "assessment", e.target.value, "manager")}
              /></td>
              <td><textarea required disabled={!isManager}
                value={savedAppraisal.manager?.[index]?.performance || ""}
                onChange={e => handleChange(index, "performance", e.target.value, "manager")}
              /></td>
              <td><textarea required disabled={!isManager}
                value={savedAppraisal.manager?.[index]?.achievements || ""}
                onChange={e => handleChange(index, "achievements", e.target.value, "manager")}
              /></td>
              <td><textarea required disabled={!isManager}
                value={savedAppraisal.manager?.[index]?.developments || ""}
                onChange={e => handleChange(index, "developments", e.target.value, "manager")}
              /></td>
              <td><textarea required disabled={!isManager}
                value={savedAppraisal.manager?.[index]?.training || ""}
                onChange={e => handleChange(index, "training", e.target.value, "manager")}
              /></td>
            </tr>
          ))}
        </tbody>
      </table>
      Overall Comments: <textarea  style={{ border: "3px solid black" }} required />
    </div>
  );
};

export default AssessmentTable;
