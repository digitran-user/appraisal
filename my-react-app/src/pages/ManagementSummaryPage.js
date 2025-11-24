import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import DownloadPDFWrapper from "./DownloadPDFWrapper";
import PerformanceRating from "./PerformanceRating";
import ManagementSummary from "./ManagementSummary";

export default function ManagementSummaryPage() {
  // ------------ 1. Get ID from route or query param ------------
  const { empId } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q"); // from ?q=EMPID

  // always pick whichever exists
  const employeeId = empId || q;

  // ------------ 2. States ------------
  const [employee, setEmployee] = useState(null);
  const [gradeObjectives, setGradeObjectives] = useState([]);
  const [gradeGoals, setGradeGoals] = useState([]);
  const [areas, setAreas] = useState([]);

  // ------------ 3. Fetch Employee by ID ------------
  const fetchEmployee = async (id) => {
    try {
      const res = await fetch(`http://13.203.205.146:5000/api/emp/${id}`);
      const data = await res.json();

      setEmployee(data);

      // Fetch objectives using the grade of this employee
      fetchObjectives(data.grade);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  // ------------ 4. Fetch Objectives by Grade ------------
  const fetchObjectives = async (grade) => {
    try {
      const res = await fetch(`http://13.203.205.146:5000/api/objectives/${grade}`);
      const objData = await res.json();

      setGradeObjectives(objData?.objectives || []);
      setGradeGoals(objData?.goals || []);
      setAreas(objData?.aoas?.map((item) => item.value) || []);
    } catch (err) {
      console.error("Error fetching objectives:", err);
    }
  };

  // ------------ 5. Load employee when employeeId is available ------------
  useEffect(() => {
    if (employeeId) {
      fetchEmployee(employeeId);
    }
  }, [employeeId]);

  // ------------ 6. UI ------------
  return (
    <div className="container">
      <h2>Management Summary</h2>

      {!employee ? (
        <p>Loading employee...</p>
      ) : (
        <>
          <DownloadPDFWrapper fileName={`${employee.empName}_Management_Summary`}>
            {/* ================= Employee Details ================= */}
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
              {/* <div className="form-group"><label>Submitted Date by Employee:</label><label>{employee.submittedAt}</label></div>
              <div className="form-group"><label>Submitted Date by Manager:</label><label>{employee.submittedAt}</label></div>
              <div className="form-group"><label>Submitted Date by Management:</label><label>{employee.submittedAt}</label></div> */}
              
            </form>

            <div className="line" />

            {/* ================= Summary Section ================= */}
            <ManagementSummary
              empId={employee.empID}
              objectives={gradeObjectives}
              grade={employee.grade}
              goals={gradeGoals}
              areas={areas}
              previousRating={employee.previousYearRating}
            />
          </DownloadPDFWrapper>
        </>
      )}
    </div>
  );
}
