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
    const viewer = queryParams.get("z");

    setIsManager(viewer !== "self"); // if z=self → employee view

    if (empId) {
      fetchEmployee(empId);
    }
  }, []);

  // ✅ Handles general form-level changes (if any)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppraisal((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit entire appraisal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee) {
      alert("Employee data not loaded yet!");
      return;
    }

    const finalData = {
      employeeId: employee.empID,
      employeeName: employee.empName,
      grade: employee.grade,
      department: employee.department,
      designation: employee.designation,
      appraisalData: appraisal,
      submittedBy: isManager ? "manager" : "employee",
      submittedAt: new Date(),
    };

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
            <div className="form-group"><label>Manager/Lead:</label><label>{employee.reportsTo}</label></div>
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

            <div className="form-group full-width">
              <button type="submit" className="submit-btn">
                Submit Appraisal
              </button>
            </div>
          </form>

          {/* For Debugging */}
          <pre>{JSON.stringify(appraisal, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default AppraisalForm;
