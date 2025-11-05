import React, { useState } from "react";

function Objective({ objectives = [], goals = [], grade, isManager, appraisal, setAppraisal }) {
  // ✅ Update values inside `appraisal` dynamically
  const handleChange = (index, field, value, type) => {
    setAppraisal((prev) => {
      const updated = { ...prev };
      if (!updated[type]) updated[type] = []; // create section if missing
      updated[type][index] = {
        ...(updated[type][index] || {}),
        [field]: value,
      };
      return updated;
    });
  };

  return (
    <div>
      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <h2 style={{ width: "50%" }}>Half-Yearly Objectives</h2>
            <h2 style={{ width: "50%" }}>Annual Objectives</h2>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* Half-Yearly */}
            <table border="1" cellPadding="8" style={{ width: "50%" }}>
              <thead>
                <tr>
                  <th>Objective</th>
                  <th>Weight %</th>
                </tr>
              </thead>
              <tbody>
                {objectives.map((obj) => (
                  <tr key={obj.key}>
                    <td>{obj.value}</td>
                    <td>{obj.per}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Annual */}
            <table border="1" cellPadding="8" style={{ width: "50%" }}>
              <thead>
                <tr>
                  <th>Objective</th>
                  <th>Weight %</th>
                </tr>
              </thead>
              <tbody>
                {objectives.map((obj) => (
                  <tr key={obj.key}>
                    <td>{obj.value}</td>
                    <td>{obj.per}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Goals section */}
      <div style={{ marginTop: "40px" }}>
        <h2>Goals</h2>
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Weight %</th>
              <th>Self Rating</th>
              <th>Manager Rating</th>
              <th>Management Rating</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>

                {/* ✅ Self rating */}
                <td>
                  <input
                    type="text"
                    value={appraisal.selfGoals?.[index]?.rating || ""}
                    onChange={(e) => handleChange(index, "rating", e.target.value, "selfGoals")}
                    placeholder="Enter self rating"
                    disabled={isManager}
                  />
                </td>

                {/* ✅ Manager rating */}
                <td>
                  <input
                    type="text"
                    value={appraisal.managerGoals?.[index]?.rating || ""}
                    onChange={(e) => handleChange(index, "rating", e.target.value, "managerGoals")}
                    placeholder="Enter manager rating"
                    disabled={!isManager}
                  />
                </td>

                {/* ✅ Management rating */}
                <td>
                  <input
                    type="text"
                    value={appraisal.managementGoals?.[index]?.rating || ""}
                    onChange={(e) => handleChange(index, "rating", e.target.value, "managementGoals")}
                    placeholder="Enter management rating"
                    disabled={!isManager}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Objective;
