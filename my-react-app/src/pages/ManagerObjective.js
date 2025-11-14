import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManagerObjective({ objectives = [], goals = [], areas = [], empId, previousRating}) {
  
  const [previousYearRating, setPreviousYearRating] = useState(null);
  const [comments,setComments] = useState("");
  const [selfAverage,setSelfAverage] = useState("");
  const [managerAverage,setManagerAverage] = useState("");
  const [selfRating, setSelfRating] =useState(null);
  const [employeeId, setEmployeeID] = useState(null);
  const [reporteeappraisal, setReporteeAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);
 const [checked, setChecked] = useState(false);
 const navigate = useNavigate();
  // Fetch appraisal data on mount or empId change
  useEffect(() => {
    setPreviousYearRating(previousRating);
    setEmployeeID(empId);
    fetchAppraisal();
    // eslint-disable-next-line
  }, [empId]);

  const fetchAppraisal = async () => {
    try {
       const response = await fetch(`http://localhost:5000/api/selfAppraisal/${empId}`);
       const resData = await response.json();
       if(resData){
        setSelfRating(resData);
        
       }
      console.log(resData);
      // Use template literal to insert empId
      const res = await fetch(`http://localhost:5000/api/managerAppraisal/${empId}`);
      const data = await res.json();
      if (data) {
        setReporteeAppraisal(data);
        console.log(data.comments);
        setComments(data.comments);
      } else {
        setReporteeAppraisal({
          managerGoals: goals.map((g) => ({ key: g.key, rating: "" ,achievements: ""})),
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
      setReporteeAppraisal({
        managerGoals: goals.map((g) => ({ key: g.key, rating: "" ,achievements: ""})),
        manager: areas.map(() => ({
          assessment: "",
          performance: "",
          achievements: "",
          developments: "",
          training: "",
        })),
        
      });
      setComments("");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (reporteeappraisal?.managerGoals?.length && selfRating?.selfGoals?.length) {
    const selfAvg = calculateAverageSelf(
      reporteeappraisal.managerGoals,
      selfRating.selfGoals
    );
    setSelfAverage(selfAvg);

    const managerAvg = calculateAverageManager(reporteeappraisal.managerGoals);
    setManagerAverage(managerAvg);
  }
}, [reporteeappraisal, selfRating]);


  // Update field values dynamically
  const handleComment=(value) =>{
setComments(value);
  }
    const handleChange = (index, key, value, section) => {
     // debugger
      if (value != "" && section ==="managerGoals") {
      let ratingValue = parseInt(value);
      if (ratingValue > 5) {
        alert("Rating cannot exceed 5");
        return;
      }
    } 
     if (value != "" && section ==="achievements") {
      let achievement = parseInt(value);
      let achievementAllowed = goals[index].per;
      if (achievement > achievementAllowed) {
        alert(`Achievement cannot exceed ${achievementAllowed}`);
        return;
      }
    } 

    setReporteeAppraisal((prev) => {
      const updatedApp = { ...prev };
      if (section === "managerGoals") {
       const managerGoals = [...(updatedApp.managerGoals || [])];
        managerGoals[index] = {
          ...(managerGoals[index] || {}),
          rating: value,
          key: key,
        };
        updatedApp.managerGoals = managerGoals;

      }

      if (section === "achievements") {
  const managerGoals = [...(updatedApp.managerGoals || [])];
  managerGoals[index] = {
    ...(managerGoals[index] || {}),
    achievements: value,
    key: key,
    // maintain other properties if any
  };
  updatedApp.managerGoals = managerGoals;
}
      if (section === "manager") {
        const manager = [...(updatedApp.manager || [])];
        manager[index] = { ...(manager[index] || {}), [key]: value };
        updatedApp.manager = manager;
      }
       console.log(updatedApp);
      return updatedApp;
    });
    //alert(JSON.stringify(selfRating.selfGoals));
    
   setSelfAverage(calculateAverageSelf(reporteeappraisal.selfGoals, selfRating.selfGoals ));
   setManagerAverage( calculateAverageManager(reporteeappraisal.managerGoals));
  };


  // Save to backend
  const handleSave = async (e) => {
    //console.log(reporteeappraisal);
    e.preventDefault();

     // --- 1) validate goal ratings ---
  for (let i = 0; i < goals.length; i++) {
    const goal = goals[i];
    const rating = reporteeappraisal.managerGoals?.[i]?.rating;
    if (!rating || String(rating).trim() === "") {
      alert(`Please enter manager rating for goal: "${goal.value}"`);
      const el = document.getElementsByName(`managerGoal_${goal.key}`)[0];
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
    try {
      const payload = {
        empID: employeeId,
        managerGoals: reporteeappraisal.managerGoals,
        manager: reporteeappraisal.manager,
         submittedAt: new Date(),
         comments: comments,
      };
      alert(JSON.stringify(payload));
      await axios.post("http://localhost:5000/api/managerAppraisal", payload);
      alert("✅ Appraisal saved successfully!");
      e.preventDefault();
    } catch (err) {
      console.error("Error saving appraisal:", err);
      alert("❌ Failed to save appraisal");
    }
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (!reporteeappraisal) return <p>No data found.</p>;

  //calculate average rating
const calculateAverageManager = (goals = []) => {
  if (!goals?.length) return 0;

  

  let totalWeighted = 0;
  let totalCount = 0;

  goals.forEach((goal) => {
    const achievement = Number(goal.achievements) || 0;
    const rating = Number(goal.rating) || 0;
    totalWeighted += (achievement*rating)/100;
    console.log(totalWeighted);
    totalCount++;
  });

  return  Math.round(totalWeighted) ? Math.round(totalWeighted) : 0;
};

const calculateAverageSelf = (managerGoals = [], selfGoals = []) => {
 
  if (!managerGoals?.length || !selfGoals?.length) return 0;

  let totalWeighted = 0;
  let totalCount = 0;

  managerGoals.forEach((mg) => {
    // find corresponding self rating by matching goal key
    const selfGoal = selfGoals.find((sg) => sg.key === mg.key);

    const achievement = Number(mg.achievements) || 0;  // manager input
    const rating = Number(selfGoal?.rating) || 0;       // self input
    

    // only calculate if both are non-zero
    if (achievement && rating) {
      totalWeighted += (achievement / 100) * rating;
      totalCount++;
    }
  });

  return totalCount ? Math.round(totalWeighted) : 0;
};




// const selfAverage = calculateAverage(reporteeappraisal.selfGoals);
// const managerAverage = calculateAverage(reporteeappraisal.managerGoals);



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
                <textarea disabled style= {{border:"1px solid black"}}value={selfRating.self?.[index]?.assessment || "—"}></textarea>
                    <label>Manager Comments</label>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.assessment || ""}
                    onChange={(e) =>
                      handleChange(index, "assessment", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                <label>Emp Comments</label>
                <textarea disabled style= {{border:"1px solid black"}}value={selfRating.self?.[index]?.performance || "—"}></textarea>
                 <label>Manager Comments</label>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.performance || ""}
                    onChange={(e) =>
                      handleChange(index, "performance", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                <label>Emp Comments</label>
                <textarea disabled style= {{border:"1px solid black"}}value={selfRating.self?.[index]?.achievements || "—"}></textarea>
                 <label>Manager Comments</label>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.achievements || ""}
                    onChange={(e) =>
                      handleChange(index, "achievements", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                <label>Emp Comments</label>
                <textarea disabled style= {{border:"1px solid black"}}value={selfRating.self?.[index]?.developments || "—"}></textarea>
                 <label>Manager Comments</label>
                  <textarea
                    value={reporteeappraisal.manager?.[index]?.developments || ""}
                    onChange={(e) =>
                      handleChange(index, "developments", e.target.value, "manager")
                    }
                  />
                </td>
                <td>
                <label>Emp Comments</label>
                <textarea disabled style= {{border:"1px solid black"}}value={selfRating.self?.[index]?.training || "—"}></textarea>
                 <label>Manager Comments</label>
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

      {/* Goals section */}
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
             
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr key={goal.key}>
                <td>{goal.value}</td>
                <td>{goal.per}%</td>
                {/* ✅ Achievements % */}
<td>
  <div>
  <input
    type="text"
    name={`ach_${goal.key}`}
    min="0"
    max="{goal.per}%"
    //disabled={!isNaN(reporteeappraisal.managerGoals?.[index]?.achievements)}
    value={reporteeappraisal.managerGoals?.[index]?.achievements || ""}
    onChange={(e) =>
      handleChange(index, goal.key, e.target.value, "achievements")
    }
    placeholder="Enter achievement %"
   // disabled={isManager}
    required
  />
   
   </div>
</td>

{/* ✅ Previous Cycle Rating */}

<td>
  <label>{previousYearRating}</label>
   
  
</td>
              <td>
              
                  <label>{selfRating.selfGoals
    ?.filter(Boolean)
    .find((g) => g.key === goal.key)?.rating || "—"}
                </label>
                </td>
              
        {/* Manager rating */}
<td>
  <input
    type="text"
    name={goal.key}
    min="0"
    max={goal.per}
     //disabled={!isNaN(reporteeappraisal.managerGoals?.[index]?.rating)}
    value={reporteeappraisal.managerGoals?.[index]?.rating || ""}
    onChange={(e) => handleChange(index, goal.key, e.target.value, "managerGoals")}
    placeholder="Enter manager rating"
    //disabled={!canEditManager}
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
  </tr>

          </tbody>
        </table>
        <div className="spacer" />


        
        
        Manager's Comments : <textarea style={{border : "2px solid #4CAF50"}}
        value={comments || ""}
        onChange={(e) =>handleComment(e.target.value)}/>
        <div style={{display: "flex",
            justifyContent: "flex-start", marginTop: "20px",marginRight: "10px"}}> 
         
          
            <input type="checkbox" name="agreement" required  style={{display: "flex",
             width: "3%",
            justifyContent: "flex-start",
             marginRight:"10px"}}></input>
            <span>
              The data provided are to the best of my knowledge and I accept all terms of use.{" "}
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

export default ManagerObjective;