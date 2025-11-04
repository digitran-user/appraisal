import React, { useEffect, useState } from "react";

const Objective = () => {
  const [data, setData] = useState(null);
const [text, setText] = useState("");
  const fetchObjective = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/objectives/PE`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching objective:", err);
    }
  };

  useEffect(() => {
    fetchObjective();
  }, []);

  if (!data) return <p>Loading objectives...</p>;

  return (
    <div>
    <div class="table-container">
      
      <h2>Half yearly Objectives</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Weight %</th>
          </tr>
        </thead>
        <tbody>
          {data.objectives.map(obj => (
            <tr key={obj.key}>
              <td>{obj.value}</td>
              <td>{obj.per}%</td>
            </tr>
          ))}
        </tbody>
      </table>
       <h2>Annual Objectives</h2>
    <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Weight %</th>
          </tr>
        </thead>
        <tbody>
          {data.objectives.map(obj => (
            <tr key={obj.key}>
              <td>{obj.value}</td>
              <td>{obj.per}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
          {data.goals.map(goal => (
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
};

export default Objective;