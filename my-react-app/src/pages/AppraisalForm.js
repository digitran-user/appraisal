import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PerformanceRating from "../pages/PerformanceRating";
import Objective from "../pages/Objective";
import AssessmentTable from "../pages/AssessmentTable";

function AppraisalForm() {
  const location = useLocation();

  const [appraisal, setAppraisal] = useState({});
  const [employee, setEmployee] = useState(null);
  const [gradeObjectives, setGradeObjectives] = useState([]);
  const [gradeGoals, setGradeGoals] = useState([]);
  const [isManager, setIsManager] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  // ✅ Fetch employee
  const fetchEmployee = async (empId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/emp/${empId}`);
      const data = await res.json();
      setEmployee(data);
      fetchObjectives(data.grade);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  // ✅ Fetch objectives by grade
  const fetchObjectives = async (grade) => {
    try {
      const res = await fetch(`http://localhost:5000/api/objectives/${grade}`);
      const objData = await res.json();
      setGradeObjectives(objData?.objectives || []);
      setGradeGoals(objData?.goals || []);
    } catch (err) {
      console.error("Error fetching objectives:", err);
    }
  };

  // ✅ Extract empID from URL & fetch employee
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const empId = queryParams.get("q");
    const viewer = queryParams.get("z");

    setIsManager(viewer !== "self"); // if z=self → employee view

    if (empId) {
      fetchEmployee(empId);
    }
  }, []);

  // ✅ Checkbox handler
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // ✅ Submit entire appraisal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee) {
      alert("Employee data not loaded yet!");
      return;
    }

    const finalData = {
      
      
      appraisalData: appraisal,
      submittedBy: isManager ? "manager" : "employee",
      submittedAt: new Date(),
    };
     try {
    // Suppose you have these values in state:
    // empId → current employee’s ID (like "E123")
    // appraisal → the full object that holds objectives + assessments, etc.

    const response = await fetch(`http://localhost:5000/api/appraisals/${employee.empID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({finalData}),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Appraisal saved successfully!");
      console.log("Updated employee:", data.employee);
    } else {
      alert(`❌ Failed to save appraisal! ${data.message || ""}`);
      console.error("Server response:", data);
    }
  } catch (error) {
    console.error("❌ Error while saving appraisal:", error);
    alert("❌ Error saving appraisal!");
  }

    
    alert(JSON.stringify(finalData));
  };

  return (
    <div className="container">
      <h2>Employee Appraisal Form</h2>

      {!employee ? (
        <p>Loading employee...</p>
      ) : (
        <>
          {/* ✅ EMPLOYEE DETAILS */}
          <form className="form-grid">
            <div className="form-group"><label>Name:</label><label>{employee.empName}</label></div>
            <div className="form-group"><label>Employee ID:</label><label>{employee.empID}</label></div>
            <div className="form-group"><label>Grade:</label><label>{employee.grade}</label></div>
            <div className="form-group"><label>Designation:</label><label>{employee.designation}</label></div>
            <div className="form-group"><label>Department:</label><label>{employee.department}</label></div>
            <div className="form-group"><label>Date of Joining:</label><label>{employee.doj}</label></div>
            <div className="form-group"><label>Location:</label><label>{employee.location}</label></div>
            <div className="form-group"><label>Service Period:</label><label>{employee.servicePeriod}</label></div>
            <div className="form-group"><label>Assessment Period:</label><label>{employee.assPeriod}</label></div>
            <div className="form-group"><label>Assessment Cycle:</label><label>{employee.assessmentCycle}</label></div>
            <div className="form-group"><label>Assessment Type:</label><label>{employee.assessmentType}</label></div>
            <div className="form-group"><label>Manager/Appraiser:</label><label>{employee.reportsTo}</label></div>
            <div className="form-group"><label>Management/Appraiser:</label><label>{employee.management}</label></div>
          </form>

          <div className="line" />
          <div className="spacer" />

          {/* ✅ MAIN APPRAISAL FORM */}
          <form onSubmit={handleSubmit}>
            <PerformanceRating
              appraisal={appraisal}
              setAppraisal={setAppraisal}
              isManager={isManager}
            />

            <Objective
              objectives={gradeObjectives}
              grade={employee.grade}
              goals={gradeGoals}
              isManager={isManager}
              appraisal={appraisal}
              setAppraisal={setAppraisal}
            />

            <AssessmentTable
              grade={employee.grade}
              isManager={isManager}
              appraisal={appraisal}
              setAppraisal={setAppraisal}
            />

            {/* ✅ Checkbox AFTER Overall Comments */}
            <div style={{ paddingTop: "20px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />{" "}
                I agree that the above appraisal details are correct.
              </label>
              {isChecked && (
                <p style={{ color: "green", marginTop: "8px" }}>
                  ✅ Acknowledged by {isManager ? "Manager" : "Employee"}.
                </p>
              )}
            </div>

            <div className="form-group full-width">
              <button type="submit" className="submit-btn">
                Submit Appraisal
              </button>
            </div>
          </form>

          {/* Debugging view */}
          <pre>{JSON.stringify(appraisal, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default AppraisalForm;
