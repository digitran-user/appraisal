import React, { useState } from "react";

function Objective({ objectives = [], goals = [], grade, isManager, appraisal, setAppraisal }) {
 const handleChange = (index, key, value, type) => {
    setAppraisal((prev) => {
      const updatedGoals = [...(prev[type] || [])];
      updatedGoals[index] = {
        ...(updatedGoals[index] || {}),
        key,
        rating: value,
      };
      return {
        ...prev,
        [type]: updatedGoals,
      };
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
              <th>Achievements %</th>
               <th>Previous Cycle Rating (PAEY24-25)</th>
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
  <input/>
  </td>       
    <td>
  <input/>
  </td> 
                {/* ✅ Self rating */}
<td>
  <input
    type="number"
    name={goal.key}
    min="0"
    max={goal.per} // dynamic max per goal
    value={
  appraisal.selfGoals?.find((g) => g.key === goal.key)?.rating || ""
}
    onChange={(e) => {
      const val = e.target.value;
    //  if (val === "" || (Number(val) >= 0 && Number(val) <= Number(goal.per))) {
        handleChange(index, goal.key, val, "selfGoals");
   //   }
    }}
    placeholder="Enter self rating"
    disabled={isManager}
    required
  />
</td>

{/* ✅ Manager rating */}
<td>
  <input
    type="number"
    min="0"
    max={goal.per}
    name={goal.key}
    value={appraisal.managerGoals?.find((g) => g.key === goal.key)?.rating || ""}
    onChange={(e) => {
      const val = e.target.value;
     // if (val === "" || (Number(val) >= 0 && Number(val) <= Number(goal.per))) {
        handleChange(index, goal.key, val, "managerGoals");
     // }
    }}
    placeholder="Enter manager rating"
    disabled={!isManager}
    required
  />
</td>

{/* ✅ Management rating */}
<td>
  <input
    type="number"
    min="0"
    max={goal.per}
    name={goal.key}
    value={appraisal.managementGoals?.find((g) => g.key === goal.key)?.rating || ""}
    onChange={(e) => {
      const val = e.target.value;
     // if (val === "" || (Number(val) >= 0 && Number(val) <= Number(goal.per))) {
        handleChange(index, goal.key, val, "managementGoals");
     // }
    }}
     placeholder="Enter management rating"
    disabled={!isManager}
    required
  />
</td>
<td>
  <input/>
  </td>       
    

              </tr> 
            ))} 
            <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><input placeholder="Overall Rating"></input></td>
            <td><input placeholder="Overall Rating"></input></td>
            <td><input placeholder="Overall Rating"></input></td>
            <td></td>
            


            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Objective;
