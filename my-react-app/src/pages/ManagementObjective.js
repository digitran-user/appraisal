import React, { useState, useEffect } from "react";
import axios from "axios";

// --- CALCULATE AVERAGES --- //
const calculateAverageManagement = (managerGoals = [], managementGoals = []) => {
  if (!managerGoals?.length || !managementGoals?.length) return 0;

  let totalWeighted = 0;
  let totalCount = 0;

  managerGoals.forEach((mg) => {
    const mgmtGoal = managementGoals.find((gg) => gg.key === mg.key);
    const achievement = Number(mg.achievements) || 0;
    const rating = Number(mgmtGoal?.rating) || 0;

    if (achievement && rating) {
      totalWeighted += (achievement / 100) * rating;
      totalCount++;
    }
  });

  return totalCount ? Number((totalWeighted / totalCount).toFixed(0)) : 0;
};

const calculateAverageSelf = (managerGoals = [], selfGoals = []) => {
  if (!managerGoals?.length || !selfGoals?.length) return 0;

  let totalWeighted = 0;
  let totalCount = 0;

  managerGoals.forEach((mg) => {
    const selfGoal = selfGoals.find((sg) => sg.key === mg.key);
    const achievement = Number(mg.achievements) || 0;
    const rating = Number(selfGoal?.rating) || 0;

    if (achievement && rating) {
      totalWeighted += (achievement / 100) * rating;
      totalCount++;
    }
  });

  return totalCount ? Number((totalWeighted / totalCount).toFixed(0)) : 0;
};

const calculateAverageManager = (managerGoals = []) => {
  if (!managerGoals?.length) return 0;

  let totalWeighted = 0;
  let totalCount = 0;

  managerGoals.forEach((goal) => {
    const achievement = Number(goal.achievements) || 0;
    const rating = Number(goal.rating) || 0;

    if (achievement && rating) {
      totalWeighted += (achievement / 100) * rating;
      totalCount++;
    }
  });

  return totalCount ? Number((totalWeighted / totalCount).toFixed(0)) : 0;
};

// --- COMPONENT STARTS --- //
function ManagementObjective({ objectives = [], goals = [], areas = [], empId }) {
  const [comments, setComments] = useState("");
  const [selfRating, setSelfRating] = useState(null);
  const [selfAverage, setSelfAverage] = useState("");
  const [managerAverage, setManagerAverage] = useState("");
  const [managementAverage, setManagementAverage] = useState("");
  const [employeeId, setEmployeeID] = useState(null);
  const [reporteeappraisal, setReporteeAppraisal] = useState(null);
  const [managementAppraisal, setManagementAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  // Fetch employee data
  useEffect(() => {
    setEmployeeID(empId);
    fetchAppraisal();
    // eslint-disable-next-line
  }, [empId]);

  const fetchAppraisal = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/selfAppraisal/${empId}`);
      const resData = await response.json();
      if (resData) setSelfRating(resData);

      const res = await fetch(`http://localhost:5000/api/managerAppraisal/${empId}`);
      const data = await res.json();
      if (data) {
        setReporteeAppraisal(data);
        setComments(data.comments || "");
      }

      const resManagement = await fetch(`http://localhost:5000/api/managementAppraisal/${empId}`);
      const managementData = await resManagement.json();
      if (managementData) {
        setManagementAppraisal(managementData);
      } else {
        setManagementAppraisal({
          managementGoals: goals.map((g) => ({ key: g.key, rating: "", comments: "" })),
          submittedAt: Date(),
          submittedBy: "",
          averageSelfRating: "",
          averageManagerRating: "",
          averageManagementRating: "",
        });
      }
    } catch (error) {
      console.error("Error fetching appraisal:", error);
      setManagementAppraisal({
        managementGoals: goals.map((g) => ({ key: g.key, rating: "", comments: "" })),
        submittedAt: Date(),
        submittedBy: "",
        averageSelfRating: "",
        averageManagerRating: "",
        averageManagementRating: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Calculate averages dynamically --- //
  useEffect(() => {
    if (reporteeappraisal?.managerGoals?.length && selfRating?.selfGoals?.length) {
      // Self average → Manager achievements + Self rating
      const selfAvg = calculateAverageSelf(
        reporteeappraisal.managerGoals,
        selfRating.selfGoals
      );
      setSelfAverage(selfAvg);

      // Manager average → Manager achievements + Manager rating
      const mgrAvg = calculateAverageManager(reporteeappraisal.managerGoals);
      setManagerAverage(mgrAvg);

      // Management average → Manager achievements + Management rating
      const mgmtAvg = calculateAverageManagement(
        reporteeappraisal.managerGoals,
        managementAppraisal?.managementGoals || []
      );
      setManagementAverage(mgmtAvg);
    }
  }, [reporteeappraisal, selfRating, managementAppraisal]);

  // --- Handle management rating/comment changes --- //
  const handleChange = (index, key, value, section) => {
    setManagementAppraisal((prev) => {
      const updatedApp = { ...prev };
      if (section === "managementGoals") {
        const managementGoals = [...(updatedApp.managementGoals || [])];
        managementGoals[index] = {
          ...(managementGoals[index] || {}),
          rating: value,
          key: key,
          comments: managementGoals[index]?.comments || "",
        };
        updatedApp.managementGoals = managementGoals;
      } else if (section === "comments") {
        const managementGoals = [...(prev.managementGoals || [])];
        managementGoals[index] = {
          ...(managementGoals[index] || {}),
          comments: value,
          key: key,
          rating: managementGoals[index]?.rating || "",
        };
        updatedApp.managementGoals = managementGoals;
      }
      return updatedApp;
    });
  };

  // --- Save data to backend --- //
  const handleSave = async (e) => {
  if (e) e.preventDefault();

  const payload = {
    empId: employeeId, // lowercase
    empID: employeeId, // uppercase
    managementGoals: managementAppraisal.managementGoals || [],
    submittedAt: new Date(),
    submittedBy: "management",
    averageSelfRating: selfAverage,
    averageManagerRating: managerAverage,
    averageManagementRating: managementAverage,
  };

  //console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      "http://localhost:5000/api/managementAppraisal",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Response:", response);
    alert("✅ Appraisal saved successfully!");
  } catch (err) {
    console.error("❌ Error saving appraisal:", err);
    if (err.response) {
      console.error("🔍 Backend Response:", err.response.data);
      alert(`❌ Server error: ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      console.error("🚫 No response received from backend:", err.request);
      alert("❌ No response from backend. Check if server is running.");
    } else {
      console.error("⚠️ Error during request setup:", err.message);
      alert("❌ Failed to send request. Check console.");
    }
  }
};


  if (loading) return <p>Loading...</p>;
  if (!managementAppraisal) return <p>No data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <>
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
        </>
      )}

      {/* --- Goals Table --- */}
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
                <td>
                  {
                    reporteeappraisal?.managerGoals?.find(
                      (g) => g.key === goal.key
                    )?.achievements || "—"
                  }
                </td>
                <td>PreviousCycleRating</td>
                <td>
                  {
                    selfRating?.selfGoals?.find(
                      (g) => g.key === goal.key
                    )?.rating || "—"
                  }
                </td>
                <td>
                  {
                    reporteeappraisal?.managerGoals?.find(
                      (g) => g.key === goal.key
                    )?.rating || "—"
                  }
                </td>
                <td>
                  <input
                    type="number"
                    name={goal.key}
                    min="0"
                    max="100"
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

            <tr style={{ fontWeight: "bold", background: "#f8f9fa" }}>
              <td colSpan="4" style={{ textAlign: "right" }}>Average Rating:</td>
              <td>
                <input
                  value={selfAverage}
                  readOnly
                  style={{ textAlign: "center", background: "#e9ecef" }}
                />
              </td>
              <td>
                <input
                  value={managerAverage}
                  readOnly
                  style={{ textAlign: "center", background: "#e9ecef" }}
                />
              </td>
              <td>
                <input
                  value={managementAverage}
                  readOnly
                  style={{ textAlign: "center", background: "#e9ecef" }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* --- Overall Comments --- */}
        <div className="line" />
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
                    onChange={(e) =>
                      handleChange(index, goal.key, e.target.value, "comments")
                    }
                    placeholder="Type overall comments"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Checkbox and Save Button --- */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <input
              type="checkbox"
              required
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span style={{ fontSize: "14px", lineHeight: "1.4" }}>
              The application form would be electronically signed by you by writing
              your name in the space below and this would be considered as an
              authorized signed submission of the application form with all the
              information provided by you and all terms of use acknowledged and
              accepted, under any and all circumstances.
            </span>
          </label>
        </div>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button type="button" onClick={handleSave} className="submit-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagementObjective;
