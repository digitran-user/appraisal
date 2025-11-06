import React from "react";

function Objective({ objectives = [], grade, isManager, goals = [], appraisal, setAppraisal }) {

  const handleChange = (e, goalKey, type) => {
    const { value } = e.target;
    setAppraisal((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [goalKey]: value,
      },
    }));
  };

  return (
    <div>
      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <h2 style={{ width: "50%" }}>Half Yearly Objectives</h2>
            <h2 style={{ width: "50%" }}>Annual Objectives</h2>
          </div>
          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
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

      <div>
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
            {goals.map((goal) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>

                {/* Self rating */}
                <td>
                  <input
                    type="text"
                    name={`self_${goal.key}`}
                    placeholder="Enter self rating"
                    value={appraisal?.selfGoals?.[goal.key] || ""}
                    onChange={(e) => handleChange(e, goal.key, "selfGoals")}
                    disabled={isManager}
                  />
                </td>

                {/* Manager rating */}
                <td>
                  <input
                    type="text"
                    name={`manager_${goal.key}`}
                    placeholder="Enter manager rating"
                    value={appraisal?.managerGoals?.[goal.key] || ""}
                    onChange={(e) => handleChange(e, goal.key, "managerGoals")}
                    disabled={!isManager}
                  />
                </td>

                {/* Management rating */}
                <td>
                  <input
                    type="text"
                    name={`mgmt_${goal.key}`}
                    placeholder="Enter management rating"
                    value={appraisal?.managementGoals?.[goal.key] || ""}
                    onChange={(e) => handleChange(e, goal.key, "managementGoals")}
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
