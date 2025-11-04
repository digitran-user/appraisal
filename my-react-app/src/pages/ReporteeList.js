import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReporteeList = () => {

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get Self ID from query params
  const queryParams = new URLSearchParams(location.search);
  const selfID = queryParams.get("id");

  // ✅ Load employees from localStorage
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  

  // ✅ Navigate to appraisal page
  const handleNavigate = (emp) => {
    navigate(`/appraisal?q=${emp.empID}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reportees List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Grade</th>
            <th>Department</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, idx) => (
            <tr key={idx}>
              <td
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                onClick={() => handleNavigate(emp)}
              >
                {emp.empID}
              </td>
              <td>{emp.empName}</td>
              <td>{emp.designation}</td>
              <td>{emp.grade}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br/>
      <h2>
      <button className="submit-btn" onClick={() => navigate(`/appraisal?q=${selfID}`)}>
        Self Appraisal
      </button></h2>
    </div>
  );
};
export default ReporteeList;