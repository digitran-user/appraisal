import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PerformanceRating from "../pages/PerformanceRating";
import Objective from "../pages/Objective";
import AssessmentTable from "../pages/AssessmentTable";

function AppraisalForm() {
  const location = useLocation();

  const [employee, setEmployee] = useState(null);
  const [gradeObjectives, setGradeObjectives] = useState([]);
  const [gradeGoals, setGradeGoals] = useState([]);
  // ✅ Fetch employee
  const fetchEmployee = async (empId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/emp/${empId}`);
      const data = await res.json();
      setEmployee(data);

      // ✅ Fetch objectives using employee.grade
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
    fetchEmployee(empId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appraisal submitted!");
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
            <div className="form-group"><label>Manager/Lead:</label><label>{employee.reportsTo}</label></div>
          </form>

          <div className="line" />
          <div className="spacer" />

          {/* ✅ DYNAMIC COMPONENTS */}
          <PerformanceRating />
          <Objective objectives={gradeObjectives} grade={employee.grade} goals={gradeGoals}/>
          <AssessmentTable />

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group full-width">
              <button type="submit" className="submit-btn">Submit Appraisal</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default AppraisalForm;
