import React, { useState, useEffect } from "react";
import axios from "axios";

function ManagerObjective({ objectives = [], goals = [], areas = [], empId }) {
  const [employeeId, setEmployeeID] = useState(null);
  const [reporteeappraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
 const [checked, setChecked] = useState(false);
  // Fetch appraisal data on mount or empId change
  useEffect(() => {
    setEmployeeID(empId);
    fetchAppraisal();
    // eslint-disable-next-line
  }, [empId]);

  const fetchAppraisal = async () => {
    try {
      // Use template literal to insert empId
      const res = await fetch(`http://localhost:5000/api/selfAppraisal/${empId}`);
      const data = await res.json();
      if (data) {
        setAppraisal(data);
      } else {
        setAppraisal({
          managerGoals: goals.map((g) => ({ key: g.key, rating: "" })),
          manager: areas.map(() => ({
            assessment: "",
            performance: "",
            achievements: "",
            developments: "",
            training: "",
          })),
        });
      }
    } catch (error) {
      console.error("Error fetching appraisal:", error);
      setAppraisal({
        managerGoals: goals.map((g) => ({ key: g.key, rating: "" })),
        manager: areas.map(() => ({
          assessment: "",
          performance: "",
          achievements: "",
          developments: "",
          training: "",
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  // Update field values dynamically
  const handleChange = (index, key, value, section) => {
    setAppraisal((prev) => {
      const updated = { ...prev };
      if (section === "managerGoals") {
        const managerGoals = [...(updated.managerGoals || [])];
        managerGoals[index] = {
          ...(managerGoals[index] || {}),
          rating: value,
          key: key,
        };
        updated.managerGoals = managerGoals;
      }
      if (section === "manager") {
        const manager = [...(updated.manager || [])];
        manager[index] = { ...(manager[index] || {}), [key]: value };
        updated.manager = manager;
      }
      return updated;
    });
  };

  // Save to backend
  const handleSave = async (e) => {
    try {
      const payload = {
        empID: employeeId,
        managerGoals: reporteeappraisal.managerGoals,
        manager: reporteeappraisal.manager,
      };
      alert(JSON.stringify(payload));
      await axios.post("http://localhost:5000/api/reporteeappraisal", payload);
      alert("✅ Appraisal saved successfully!");
      e.preventDefault();
    } catch (err) {
      console.error("Error saving appraisal:", err);
      alert("❌ Failed to save appraisal");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!reporteeappraisal) return <p>No data found.</p>;

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
            {/* Half-Yearly */}
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
            {/* Annual */}
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
             
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>
                {/* ✅ Achievements % */}
<td>
  <input
    type="number"
    name={`ach_${goal.key}`}
    min="0"
    max="100"
    value={reporteeappraisal.managerGoals?.[index]?.achievements || ""}
    onChange={(e) =>
      handleChange(index, goal.key, e.target.value, "managerGoals")
    }
    placeholder="Enter achievement %"
   // disabled={isManager}
    required
  />
</td>

{/* ✅ Previous Cycle Rating */}
<td>
  <label>PreviousCycleRating</label>
   
  
</td>


                <td>
                  <label>SelfRating</label>
                </td>
              
        {/* Manager rating */}
<td>
  <input
    type="number"
    name={goal.key}
    min="0"
    max={goal.per}
    value={reporteeappraisal.managerGoals?.[index]?.rating || ""}
    onChange={(e) => handleChange(index, goal.key, e.target.value, "managerGoals")}
    placeholder="Enter manager rating"
    //disabled={!canEditManager}
    required
  />
</td>


</tr>
            ))}
          </tbody>
        </table>
        <div className="spacer" />


        <h2>Manager's Comments</h2>
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
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.assessment || ""}
                    onChange={(e) =>
                      handleChange(index, "assessment", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.performance || ""}
                    onChange={(e) =>
                      handleChange(index, "performance", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.achievements || ""}
                    onChange={(e) =>
                      handleChange(index, "achievements", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.developments || ""}
                    onChange={(e) =>
                      handleChange(index, "developments", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={reporteeappraisal.self?.[index]?.training || ""}
                    onChange={(e) =>
                      handleChange(index, "training", e.target.value, "manager")
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table> 
       <div> <label >
  <input
    type="checkbox"
    required
  />
  <span>
    The application form would be electronically signed by you by 
      writing your name in the space below and this would be considered
       as an authorized signed submission of the application form with
        all the information provided by you and all terms of use 
        acknowledged and accepted, under any and all circumstances.  </span>
</label></div>
    
        <div style={{ marginTop: "20px" ,  display: "flex", justifyContent: "center" }}>
          <button  type="button" onClick={handleSave} className="submit-btn">Save</button>
        </div>
      </div>
    </div>
  );
}

export default ManagerObjective;
