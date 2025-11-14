import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// --- CALCULATE AVERAGES --- //
const calculateAverageOverallRating = (managerGoals = [], managementGoals = []) => {
  if (!managerGoals?.length || !managementGoals?.length) return 0;

  let totalWeighted = 0;
  let count = 0;

  managerGoals.forEach((mg) => {
    const mgmtGoal = managementGoals.find((gg) => gg.key === mg.key);

    const achievement = Number(mg.achievements) || 0;      // percentage
    const rating = Number(mgmtGoal?.overallRating) || 0;   // 1–5

    const weighted = (achievement / 100) * rating;         // main formula
    totalWeighted += weighted;
    count++;
  });

  return count ? Number(totalWeighted.toFixed(0)) : 0;
};


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

  return totalCount ? Number((totalWeighted ).toFixed(0)) : 0;
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

  return totalCount ? Number((totalWeighted).toFixed(0)) : 0;
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

  return totalCount ? Number((totalWeighted).toFixed(0)) : 0;
};

// --- COMPONENT STARTS --- //
function ManagementObjective({ objectives = [], goals = [], areas = [], empId }) {
  const [comments, setComments] = useState("");
  const [overallRating, setOverallRating] = useState([]); // <-- changed to array for per-row ratings
  const [finalRating, setfinalRating] = useState("");
  const [averageOverallRating, setAverageOverallRating] = useState(0);
  const [selfRating, setSelfRating] = useState([]);
  const [selfAverage, setSelfAverage] = useState("");
  const [managerAverage, setManagerAverage] = useState("");
  const [managementAverage, setManagementAverage] = useState("");
  const [employeeId, setEmployeeID] = useState(null);
  const [reporteeappraisal, setReporteeAppraisal] = useState(null);
  const [managementAppraisal, setManagementAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

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
      // ⭐ 4️⃣ NEW — Average Overall Rating
    const overallAvg = calculateAverageOverallRating(
      reporteeappraisal.managerGoals,
      managementAppraisal?.managementGoals || []
    );
    setAverageOverallRating(overallAvg);  // <-- You must create this state
    }
    
  }, [reporteeappraisal, selfRating, managementAppraisal]);

  // Update field values dynamically
  const handleComment = (value) => {
    setComments(value);
  };

  // --- Handle management rating/comment changes --- //
  const handleChange = (index, key, value, section) => {
  debugger;
  if (value !== "" && section === "managementGoals") {
    // safe numeric casts
    const sRating = Number(selfRating?.selfGoals?.[index]?.rating) || 0;
    const managerRating = Number(reporteeappraisal?.managerGoals?.[index]?.rating) || 0;
    const mgmtRating = Number(value) || 0;

    const average = (sRating + managerRating + mgmtRating) / 3;

    // set per-row UI display
    setOverallRating((prev) => {
      const copy = Array.isArray(prev) ? [...prev] : [];
      copy[index] = Math.round(average);
      return copy;
    });

    // also store per-row inside managementAppraisal so backend receives it
    setManagementAppraisal((prev) => {
      const updatedApp = { ...prev };
      const managementGoals = [...(updatedApp.managementGoals || [])];

      managementGoals[index] = {
        ...(managementGoals[index] || {}),
        key,
        rating: value,
        comments: managementGoals[index]?.comments || "",
        overallRating: Math.round(average),   // <-- IMPORTANT CHANGE
      };

      updatedApp.managementGoals = managementGoals;
      return updatedApp;
    });

    return; // prevent duplicate update below
  }

  if (value !== "" && section === "managementGoals") {
    let ratingValue = parseInt(value);
    if (ratingValue > 5) {
      alert("Rating cannot exceed 5");
      return;
    }
  }

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

    // --- 1) validate goal ratings ---
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      const rating = managementAppraisal.managementGoals?.[i]?.rating;
      if (!rating || String(rating).trim() === "") {
        alert(`Please enter management rating for goal: "${goal.value}"`);
        const el = document.getElementsByName(`managementGoal_${goal.key}`)[0];
        if (el) el.focus();
        return;
      }
    }
    // --- 3) validate checkbox ---
    const agreementEl = document.getElementsByName("agreement")[0];
    if (!agreementEl || !agreementEl.checked) {
      alert("Please confirm the agreement checkbox before submitting.");
      if (agreementEl) agreementEl.focus();
      return;
    }

    const payload = {
  empID: employeeId,                             // ✔ only this, remove empId
  managementGoals: (managementAppraisal.managementGoals || []).map(g => ({
    key: g.key,
    rating: Number(g.rating) || 0,               // ✔ number fix
    comments: g.comments || "",
    overallRating: Number(g.overallRating) || 0, // ✔ number fix
  })),
  submittedAt: new Date(),
  submittedBy: "management",
  averageSelfRating: String(selfAverage || 0),
  averageManagerRating: String(managerAverage || 0),
  averageManagementRating: String(managementAverage || 0),
 averageOverallRating: String(averageOverallRating || 0)

};
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
    alert(`❌ Server error: ${JSON.stringify(err.response.data)}`);
  } else if (err.request) {
    alert("❌ No response from backend. Check if server is running.");
  } else {
    alert("❌ Failed to send request. Check console.");
  }
}

navigate("/");

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
        <h2>Comments</h2>
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
                <td>
                  <label>Emp Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={selfRating.self?.[index]?.assessment || "—"}
                  ></textarea>
                  <label>Manager Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={reporteeappraisal?.manager?.[index]?.assessment || "—"}
                  />
                </td>
                <td>
                  <label>Emp Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={selfRating.self?.[index]?.performance || "—"}
                  ></textarea>
                  <label>Manager Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={reporteeappraisal?.manager?.[index]?.performance || "—"}
                  />
                </td>
                <td>
                  <label>Emp Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={selfRating.self?.[index]?.achievements || "—"}
                  ></textarea>
                  <label>Manager Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={reporteeappraisal?.manager?.[index]?.achievements || "—"}
                  />
                </td>
                <td>
                  <label>Emp Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={selfRating.self?.[index]?.developments || "—"}
                  ></textarea>
                  <label>Manager Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={reporteeappraisal?.manager?.[index]?.developments || "—"}
                  />
                </td>
                <td>
                  <label>Emp Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={selfRating.self?.[index]?.training || "—"}
                  ></textarea>
                  <label>Manager Comments</label>
                  <textarea
                    disabled
                    style={{ border: "1px solid black" }}
                    value={reporteeappraisal?.manager?.[index]?.training || "—"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="spacer" />

        <h2>Goals</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Weight %</th>
              <th>Achievements %</th>
              <th>PreviousCycleRating</th>
              <th>Self Rating</th>
              <th>Manager Rating</th>
              <th>Management Rating</th>
              <th>Overall Rating</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>
                <td>
                  {reporteeappraisal?.managerGoals?.find((g) => g.key === goal.key)
                    ?.achievements || "—"}
                </td>
                <td>PreviousCycleRating</td>
                <td>
                  {selfRating?.selfGoals?.find((g) => g.key === goal.key)?.rating ||
                    "—"}
                </td>
                <td>
                  {reporteeappraisal?.managerGoals?.find((g) => g.key === goal.key)
                    ?.rating || "—"}
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
                <td>
                  <input
                    value={overallRating[index] || ""}
                    readOnly
                    style={{ textAlign: "center", background: "#fff" }}
                  />
                </td>
              </tr>
            ))}

            <tr style={{ fontWeight: "bold", background: "#f8f9fa" }}>
              <td colSpan="4" style={{ textAlign: "right" }}>
                Average Rating:
              </td>
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
              <td>
                <input
                  value={averageOverallRating}
                  readOnly
                  style={{ textAlign: "center", background: "#e9ecef" }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        Overall Comments :{" "}
        <textarea
          style={{ border: "2px solid #4CAF50" }}
          value={comments || ""}
          onChange={(e) => handleComment(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
            marginRight: "10px",
          }}
        ></div>

        {/* --- Checkbox and Save Button --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
            marginRight: "10px",
          }}
        >
          <input
            type="checkbox"
            name="agreement"
            required
            style={{
              display: "flex",
              width: "3%",
              justifyContent: "flex-start",
              marginRight: "10px",
            }}
          ></input>
          <span>
            The data provided are to the best of my knowledge and I accept all
            terms of use.{" "}
          </span>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button type="button" onClick={handleSave} className="submit-btn">
            Submit and Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagementObjective;
