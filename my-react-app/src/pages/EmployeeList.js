import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
const EmployeeList = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]); // Fix: use [] instead of null

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`http://13.203.205.146:5000/api/employees`);
      const data = await res.json();

      const excludedGrades = ["DIR", "BS5"];
      const filteredEmployees = data.filter(
        emp => !excludedGrades.includes(emp.grade)
      );
      setEmployee(filteredEmployees);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployee();
  }, []);

  // ✅ Navigate to appraisal page
  const handleNavigate = (emp) => {
    navigate(`/managementappraisal?q=${emp.empID}&z=manager`);
  };

  return (
<>
<img src={logo} alt="Logo" className="logo" onClick={() => navigate('/')} />
    <div style={{ padding: "20px" }}>
      <h2>Employee List</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Designation</th>
            <th>Grade</th>
            <th>Department</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {employee.map((emp, idx) => (
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
              <td>
  {emp.status === "with employee" ? (
    <label style={{ color: "black" }}>{emp.status}</label>
  ) : emp.status === "with manager" ? (
    <label style={{ color: "blue" }}>{emp.status}</label>
  ) : emp.status === "with management" ? (
    <label style={{ color: "orange" }}>{emp.status}</label>
  ) : (
    <label style={{ color: "green" }}>{emp.status}</label>
  )}
</td>
              <td>{emp.designation}</td>
              <td>{emp.grade}</td>
              <td>{emp.department}</td>
             <td>
  {emp.status === "completed" ? (
    <button
      onClick={() =>
        navigate(`/management/summary/${emp.empID}?q=${emp.empID}&z=management`)
      }
      style={{
        background: "#6a5acd",
        color: "white",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      View Summary
    </button>
  ) : (
    <span style={{ color: "#999" }}>—</span>
  )}
</td>


            </tr>
          ))}
        </tbody>
      </table>
      <h2>
         <button type="button" onClick={() => navigate(`/`)} className="submit-btn">
            LogOut  
          </button>
          </h2>
    </div> </>
        
  );
};

export default EmployeeList;
