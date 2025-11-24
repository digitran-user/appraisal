import React, { useState, useEffect } from "react";

// --- COMPONENT STARTS --- //
function ManagementSummary({ objectives = [], goals = [], empId }) {
  const [selfData, setSelfData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [managementData, setManagementData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize keys (string consistency)
  const normalizedGoals = goals.map((g) => ({
    ...g,
    key: String(g.key),
  }));

  const normalizedObjectives = objectives.map((o) => ({
    ...o,
    key: String(o.key),
  }));

  // Fetch all 3 datasets
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const self = await fetch(`http://13.203.205.146:5000/api/selfAppraisal/${empId}`);
        const selfRes = await self.json();
        setSelfData(selfRes);

        const mgr = await fetch(`http://13.203.205.146:5000/api/managerAppraisal/${empId}`);
        const mgrRes = await mgr.json();
        setManagerData(mgrRes);

        const mgmt = await fetch(`http://13.203.205.146:5000/api/managementAppraisal/${empId}`);
        const mgmtRes = await mgmt.json();
        setManagementData(mgmtRes);
      } catch (err) {
        console.error("Error loading summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [empId]);

  if (loading) return <p>Loading...</p>;
  if (!managementData || !managerData || !selfData)
    return <p>No data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* =============================
            OBJECTIVES - READ ONLY
      ============================== */}
      {/* {normalizedObjectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <>
          <h2 style={{ marginBottom: "10px" }}>Objectives</h2>

          <table className="assessment-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Objective</th>
                <th>Weight %</th>
              </tr>
            </thead>
            <tbody>
              {normalizedObjectives.map((obj) => (
                <tr key={obj.key}>
                  <td>{obj.value}</td>
                  <td>{obj.per}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}

      {/* =============================
             GOALS - READ ONLY
      ============================== */}
      <div style={{ marginTop: "40px" }}>
        <h2>Goals</h2>

        {normalizedGoals.length === 0 ? (
          <p>No goals found for this grade.</p>
        ) : (
          <table className="assessment-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Goal</th>
                <th>Weight %</th>
                <th>Achievements %</th>
                <th>Self Rating</th>
                <th>Manager Rating</th>
                <th>Management Rating</th>
                <th>Overall Rating</th>
              </tr>
            </thead>

            <tbody>
              {normalizedGoals.map((goal) => {
                const sg = selfData?.selfGoals?.find(
                  (g) => String(g.key) === goal.key
                );
                const mg = managerData?.managerGoals?.find(
                  (g) => String(g.key) === goal.key
                );
                const mgmt = managementData?.managementGoals?.find(
                  (g) => String(g.key) === goal.key
                );

                return (
                  <tr key={goal.key}>
                    <td>{goal.value}</td>
                    <td>{goal.per}%</td>
                    <td>{mg?.achievements || "—"}</td>
                    <td>{sg?.rating || "—"}</td>
                    <td>{mg?.rating || "—"}</td>
                    <td>{mgmt?.rating || "—"}</td>
                    <td>{mgmt?.overallRating || "—"}</td>
                  </tr>
                );
              })}

              {/* Averages */}
              <tr style={{ fontWeight: "bold", background: "#f4f4f4" }}>
                <td colSpan="3" style={{ textAlign: "right" }}>Average Rating:</td>
                <td>{managementData?.averageSelfRating || "—"}</td>
                <td>{managementData?.averageManagerRating || "—"}</td>
                <td>{managementData?.averageManagementRating || "—"}</td>
                <td>{managementData?.averageOverallRating || "—"}</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* =============================
               COMMENTS - READ ONLY
        ============================== */}
        <h3 style={{ marginTop: "30px" }}>Manager's Comments</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            background: "#f8f8f8",
          }}
        >
          {managerData?.comments || "—"}
        </div>

        <h3 style={{ marginTop: "30px" }}>Management Comments</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            background: "#f8f8f8",
          }}
        >
          {managementData?.overallComments || "—"}
        </div>
        
      </div>
      
    </div>
    
  );
}

export default ManagementSummary;
