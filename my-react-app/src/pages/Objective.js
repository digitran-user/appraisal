import React, { useState } from "react";

function Objective({ objectives = [], goals = [], grade, isManager, appraisal, setAppraisal }) {
 const handleChange = (index, key, value, type, field = "rating") => {
  setAppraisal((prev) => {
    const updatedGoals = [...(prev[type] || [])];
    updatedGoals[index] = {
      ...(updatedGoals[index] || {}),
      key,
      [field]: value, // dynamically update rating, achievement, or prevCycle
    };
    return {
      ...prev,
      [type]: updatedGoals,
    };
  });
};



//calculate average rating
const calculateAverage = (goals = []) => {
  if (!goals?.length) return 0;

  let totalWeighted = 0;
  let totalCount = 0;

  goals.forEach((goal) => {
    const achievement = Number(goal.achievement) || 0;
    const rating = Number(goal.rating) || 0;
    totalWeighted += achievement * rating;
    totalCount++;
  });

  return totalCount ? (totalWeighted / totalCount).toFixed(2) : 0;
};

const selfAverage = calculateAverage(appraisal.selfGoals);
const managerAverage = calculateAverage(appraisal.managerGoals);
const managementAverage = calculateAverage(appraisal.managementGoals);

 

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
            {/* ✅ Achievements % */}
<td>
  <input
    type="number"
    name={`ach_${goal.key}`}
    min="0"
    max="100"
    value={
      appraisal.selfGoals?.find((g) => g.key === goal.key)?.achievement || ""
    }
    onChange={(e) =>
      handleChange(index, goal.key, e.target.value, "selfGoals", "achievement")
    }
    placeholder="Enter achievement %"
    disabled={isManager}
    required
  />
</td>

{/* ✅ Previous Cycle Rating */}
<td>
  <input
    type="number"
    name={`prev_${goal.key}`}
    min="0"
    max="100"
    value={
      appraisal.selfGoals?.find((g) => g.key === goal.key)?.previousCycle || ""
    }
    onChange={(e) =>
      handleChange(index, goal.key, e.target.value, "selfGoals", "previousCycle")
    }
    placeholder="Enter previous cycle rating"
    disabled={isManager}
  />
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
            <td>
  <input
    placeholder="Overall Rating"
    value={selfAverage}
    readOnly
  />
</td>
<td>
  <input
    placeholder="Overall Rating"
    value={managerAverage}
    readOnly
  />
</td>
<td>
  <input
    placeholder="Overall Rating"
    value={managementAverage}
    readOnly
  />
</td>
            <td></td>
            


            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Objective;
