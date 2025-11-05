import React,{useState} from "react";

function Objective({ objectives = [], grade ,goals=[]}) {
  
 const [data, setData] = useState(null);
 const [text, setText] = useState("");

  return (
    <div>

      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
         <div>
    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
      <h2 style={{ width: "50%", marginBottom: "20px" }}>Half yearly Objectives</h2>
      <h2 style={{ width: "50%", marginBottom: "20px" }}>Annual Objectives</h2>
    </div>
   <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
     
      <table border="1" cellPadding="8" style={{ width: "50%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Weight %</th>
          </tr>
        </thead>
        <tbody>
          {objectives.map(obj => (
            <tr key={obj.key}>
              <td>{obj.value}</td>
              <td>{obj.per}%</td>
            </tr>
          ))}
        </tbody>
      </table>
       
    <table border="1" cellPadding="8" style={{ width: "50%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Weight %</th>
          </tr>
        </thead>
        <tbody>
          {objectives.map(obj => (
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
            <th>self rating</th>
            <th>manager rating</th>
            <th>management rating</th>
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.key}>
              <td>{goal.value}</td>
              <td>{goal.per}%</td>
              <td> <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text"
      /></td>
              <td> <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text"
      /></td>
            <td> <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text"
      /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Objective;
