import React from "react";

function Objective({ objectives = [], grade }) {
  return (
    <div>
      <h3>Objectives for Grade {grade}</h3>

      {objectives.length === 0 ? (
        <p>No objectives found for this grade.</p>
      ) : (
        <table className="objective-table">
          <thead>
            <tr>
              <th>Objective</th>
              <th>Weight (%)</th>
            </tr>
          </thead>
          <tbody>
            {objectives.map((obj, index) => (
              <tr key={index}>
                <td>{obj.value}</td>
                <td>{obj.per}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Objective;
