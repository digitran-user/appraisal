import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReporteeList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get manager ID from query params
  const queryParams = new URLSearchParams(location.search);
  const selfID = queryParams.get("id");

  // Load employees from localStorage
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  //  Manager Details
  const [manager, setManager] = useState(null);

  // Fetch manager data
  useEffect(() => {
    const fetchManager = async () => {
      if (!selfID) return;

      try {
        const res = await fetch(`http://localhost:5000/api/emp/${selfID}`);
        const data = await res.json();
        setManager(data);
      } catch (err) {
        console.error("Error fetching manager:", err);
      }
    };

    fetchManager();
  }, [selfID]);

  // Navigate to a reportee’s appraisal
  const handleNavigate = (emp) => {
    navigate(`/reporteeappraisal?q=${emp.empID}&z=manager`);
  };

  return (
    <div style={{ padding: "20px" }}>
     

       <div className="container">
     

      {!manager ? (
        <p>Loading employee...</p>
      ) : (
        <>
          {/* ✅ EMPLOYEE DETAILS */}
          <form className="form-grid">
            <div className="form-group"><label>Name:</label><label>{manager.empName}</label></div>
            <div className="form-group"><label>Employee ID:</label><label>{manager.empID}</label></div>
            <div className="form-group"><label>Grade:</label><label>{manager.grade}</label></div>
            <div className="form-group"><label>Designation:</label><label>{manager.designation}</label></div>
            <div className="form-group"><label>Department:</label><label>{manager.department}</label></div>
            <div className="form-group"><label>Date of Joining:</label><label>{manager.doj}</label></div>
            <div className="form-group"><label>Location:</label><label>{manager.location}</label></div>
            <div className="form-group"><label>Service Period:</label><label>{manager.servicePeriod}</label></div>
            <div className="form-group"><label>Assessment Period:</label><label>{manager.assPeriod}</label></div>
            <div className="form-group"><label>Assessment Cycle:</label><label>{manager.assessmentCycle}</label></div>
            <div className="form-group"><label>Assessment Type:</label><label>{manager.assessmentType}</label></div>
            <div className="form-group"><label>Manager/Appraiser:</label><label>{manager.reportsTo}</label></div>
            <div className="form-group"><label>Management/Appraiser:</label><label>{manager.management}</label></div>
          </form>

          <div className="line" />
          <div className="spacer" />

          

         
        </>
      )}
    </div>

       <div className="spacer" />
      {/* REPORTTEE TABLE */}
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
          {employees.map((emp, idx) => (
            <tr key={idx}>
              <td
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
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

      <br />
      <h2>
        <button className="submit-btn" onClick={() => navigate(`/appraisal?q=${selfID}&z=self`)}>
          Self Appraisal
        </button>
      </h2>
    </div>
  );
};

export default ReporteeList;
