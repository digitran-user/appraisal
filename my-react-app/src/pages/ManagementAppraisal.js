import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PerformanceRating from "./PerformanceRating";
import ManagerObjective from "./ManagerObjective";
import ManagementObjective from "./ManagementObjective";
import AssessmentTable from "./AssessmentTable";

function ManagementAppraisal() {
  const location = useLocation();

  //const [appraisal, setAppraisal] = useState({});
  const [employee, setEmployee] = useState(null);
  const [gradeObjectives, setGradeObjectives] = useState([]);
  const [gradeGoals, setGradeGoals] = useState([]);
  const [isManager, setIsManager] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [areas, setAreas] = useState([]);


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
      setAreas(objData?.aoas.map(item => item.value));
    } catch (err) {
      console.error("Error fetching objectives:", err);
    }
  };

  // ✅ Extract empID from URL & fetch employee
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const empId = queryParams.get("q");
    const viewer = (queryParams.get("z") || "self").toLowerCase(); // 'self' | 'manager' | 'management'

    if (empId) {
      fetchEmployee(empId);
    }
  }, []);

 

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
          <form >
            <PerformanceRating/>

            <ManagementObjective
              objectives={gradeObjectives}
              grade={employee.grade}
              empId={employee.empID}
              goals={gradeGoals}
              areas={areas}/>
    </form>

         
        </>
      )}
    </div>
  );
}

export default ManagementAppraisal;
