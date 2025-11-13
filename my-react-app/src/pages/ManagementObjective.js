import React, { useState, useEffect } from "react";
import axios from "axios";

function ManagementObjective({ objectives = [], goals = [], areas = [], empId }) {
  const [comments, setComments] = useState("");
  const [selfRating, setSelfRating] = useState(null);
  const [employeeId, setEmployeeID] = useState(null);
  const [reporteeappraisal, setReporteeAppraisal] = useState(null);
  const [managementAppraisal, setManagementAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setEmployeeID(empId);
    fetchAppraisal();
    // eslint-disable-next-line
  }, [empId]);

  const fetchAppraisal = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/selfAppraisal/${empId}`);
      const resData = await response.json();
      if (resData) {
        setSelfRating(resData);
      }
      // Fetch manager appraisal
      const res = await fetch(`http://localhost:5000/api/mangerAppraisal/${empId}`);
      const data = await res.json();
      if (data) {
        setReporteeAppraisal(data);
        setComments(data.comments || "");
      }
      // Fetch management appraisal
      const resManagement = await fetch(`http://localhost:5000/api/mangementAppraisal/${empId}`);
      const managementData = await resManagement.json();
      if (managementData) {
        setManagementAppraisal(managementData);
      } else {
        setManagementAppraisal({
          managementGoals: goals.map(g => ({ key: g.key, rating: "", comments: "" })),
          submittedAt: Date(),
          submittedBy: "",
          averageSelfRating: "",
          averageManagerRating: "",
          averageManagementRating: ""
        });
      }
    } catch (error) {
      console.error("Error fetching appraisal:", error);
      setManagementAppraisal({
        managementGoals: goals.map(g => ({ key: g.key, rating: "", comments: "" })),
        submittedAt: Date(),
        submittedBy: "",
        averageSelfRating: "",
        averageManagerRating: "",
        averageManagementRating: ""
      });
    } finally {
      setLoading(false);
    }
  };

  // Update management goal ratings and comments
  const handleChange = (index, key, value, section) => {
    setManagementAppraisal(prev => {
      const updatedApp = { ...prev };
      if (section === "managementGoals") {
        const managementGoals = [...(updatedApp.managementGoals || [])];
        managementGoals[index] = {
          ...(managementGoals[index] || {}),
          rating: value,
          key: key,
          comments: managementGoals[index]?.comments || ""
        };
        updatedApp.managementGoals = managementGoals;
      }
      if (section === "comments") {
        const managementGoals = [...(prev.managementGoals || [])];
        managementGoals[index] = {
          ...(managementGoals[index] || {}),
          comments: value,
          key: key,
          rating: managementGoals[index]?.rating || ""
        };
        updatedApp.managementGoals = managementGoals;
      }
      return updatedApp;
    });
  };

  // Save to backend
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        empID: employeeId,
        managementGoals: managementAppraisal.managementGoals,
        submittedAt: new Date(),
        submittedBy: "",
        averageSelfRating: "",
        averageManagerRating: "",
        averageManagementRating: ""
      };
      alert(JSON.stringify(payload, null, 2));
      await axios.post("http://localhost:5000/api/managementAppraisal", payload);
      alert("✅ Appraisal saved successfully!");
    } catch (err) {
      console.error("Error saving appraisal:", err);
      alert("❌ Failed to save appraisal");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!managementAppraisal) return <p>No data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <h2 style={{ width: "50%" }}>Half-Yearly Objectives</h2>
            <h2 style={{ width: "50%" }}>Annual Objectives</h2>
          </div>
          <div style={{ display: "flex" }} className="assessment-table">
            <table style={{ width: "50%" }}>
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
            <table style={{ width: "50%" }}>
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
      <div style={{ marginTop: "40px" }} className="assessment-table">
        <h2>Goals</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Weight %</th>
              <th>Achievements</th>
              <th>PreviousCycleRating</th>
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
                {/* Achievements display */}
                <td>
                  <label>
                    {reporteeappraisal?.managerGoals
                      ?.filter(Boolean)
                      .find((g) => g.key === goal.key)?.achievements || "—"}
                  </label>
                </td>
                {/* Previous Cycle Rating */}
                <td>
                  <label>PreviousCycleRating</label>
                </td>
                {/* Self Rating */}
                <td>
                  <label>
                    {selfRating?.selfGoals
                      ?.filter(Boolean)
                      .find((g) => g.key === goal.key)?.rating || "—"}
                  </label>
                </td>
                {/* Manager rating */}
                <td>
                  <label>
                    {reporteeappraisal?.managerGoals
                      ?.filter(Boolean)
                      .find((g) => g.key === goal.key)?.rating || "—"}
                  </label>
                </td>
                {/* Management rating input */}
                <td>
                  <input
                    type="number"
                    name={goal.key}
                    min="0"
                    max={goal.per}
                    value={managementAppraisal.managementGoals?.[index]?.rating || ""}
                    onChange={(e) =>
                      handleChange(index, goal.key, e.target.value, "managementGoals")
                    }
                    placeholder="Enter management rating"
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Overall Comments per goal */}
        <div className="line" />
        <div className="spacer" />
        <h2> Overall Comments</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Weight %</th>
              <th>Overall Comments</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>
                <td>
                  <textarea
                    value={managementAppraisal.managementGoals?.[index]?.comments || ""}
                    onChange={e =>
                      handleChange(index, goal.key, e.target.value, "comments")
                    }
                    placeholder="Type overall comments"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="spacer" />
        <div>
          <label>
            <input
              type="checkbox"
              required
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
            />
            <span>
              The application form would be electronically signed by you by writing your name in the space below and this would be considered as an authorized signed submission of the application form with all the information provided by you and all terms of use acknowledged and accepted, under any and all circumstances.
            </span>
          </label>
        </div>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button type="button" onClick={handleSave} className="submit-btn">Save</button>
        </div>
      </div>
    </div>
  );
}

export default ManagementObjective;
