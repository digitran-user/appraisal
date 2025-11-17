import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]); // Fix: use [] instead of null

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employees`);
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
    <div style={{ padding: "20px" }}>
      <h2>Reportees List</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Designation</th>
            <th>Grade</th>
            <th>Department</th>
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
              <td>{emp.status}</td>
              <td>{emp.designation}</td>
              <td>{emp.grade}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
