

import React, {useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PerformanceRating from "../pages/PerformanceRating";
import Objective from "../pages/Objective";
import AssessmentTable from "../pages/AssessmentTable";
function AppraisalForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMananger, setIsManager] = useState(true);
  const [empGrade , setEmpGrade ] = useState([]);
  const[employee, setEmployee] = useState([]);
  const fetchEmployee = async (empId) => {
      try {
      const res = await fetch(`http://localhost:5000/api/emp/${empId}`);
      const data = await res.json();
      setEmployee(data);
      setEmpGrade(data.grade);
      console.log(data);
        } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
  useEffect(() => {

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const empId = queryParams.get("q");
     fetchEmployee(empId);  
     }, []);

  const [appraisal, setAppraisal] = useState({
      
  });

  const handleChange = (e) => {
   const { name, value } = e.target;
   setAppraisal({ ...appraisal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appraisal Data:", appraisal);
    alert("Appraisal submitted successfully!");
    try {
      
        const res = fetch(`http://localhost:5000/api/appraisals/${employee.empID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appraisal)
       });
       alert(res.status);
    } catch (err) {
        console.error("Error fetching employee:", err);
      }


  };

  return (
    <div className="container">
      <h2>Employee Appraisal Form</h2>
      <form  className="form-grid">
        <div className="form-group">
          <label>Name:</label>
           <label>{employee.empName}</label>
        </div>

        <div className="form-group">
          <label>Employee ID:</label>
           <label>{employee.empID}</label>
         </div>
        <div className="form-group">
          <label>Grade:</label>
           <label>{employee.grade}</label>
         </div>
         <div className="form-group">
          <label>Designation:</label>
           <label>{employee.designation}</label>
         </div>
        <div className="form-group">
          <label>Department:</label>
           <label>{employee.department}</label>
        </div>
        <div className="form-group">
          <label>Date of Joining:</label>
           <label>{employee.doj}</label>
        </div>

         <div className="form-group">
          <label>Location:</label>
           <label>{employee.location}</label>
        </div>
         <div className="form-group">
          <label>Service Period:</label>
           <label>{employee.servicePeriod}</label>
        </div>
         <div className="form-group">
          <label>Assessment Period:</label>
           <label>{employee.assPeriod}</label>
        </div>
         <div className="form-group">
          <label>Manager/Lead:</label>
           <label>{employee.reportsTo}</label>
        </div>
        </form>
       <div className="line" />
       <div className="spacer"/>
       {employee ? (
  <>
    <PerformanceRating />
    <Objective />
    <AssessmentTable/>
  </>
) : (
  <p>Loading Employee...</p>
)}
       <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group  full-width">
          <div className="center-text">Employee Self Assessment:</div>
         </div>

        <div className="form-group full-width">
          <label>Summarize your performance:</label>
          <textarea
            name="performanceSummary"
           
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>

      <div className="form-group full-width">
          <label>Significant Achievement:</label>
          <textarea
            name="achievement"
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label>Developments:</label>
          <textarea
            name="developments"
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label>Training Required:</label>
          <textarea
            name="training"
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>
         <div className=" form-group full-width line" />
     
        <div className="form-group full-width">
          <div className="center-text">Manager Comments:</div>
        </div>
        <div className="form-group full-width">
          <label>Summarize  performance:</label>
          <textarea
            name="suggestedPerformanceSummary"
            onChange={handleChange}
            rows="10"
            required  disabled= {isMananger}
          ></textarea>
        </div>

      <div className="form-group full-width">
          <label>Significant Achievement:</label>
          <textarea
            name="suggestedAchievements"
            onChange={handleChange}
            rows="10"
            required
             disabled= {isMananger}
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label>Developments:</label>
          <textarea
            name="suggestedDevelopments"
            onChange={handleChange}
            rows="10"
            required
             disabled= {isMananger}
          ></textarea>
        </div>

        <div className="form-group full-width">
          <label>Training Required:</label>
          <textarea
            name="suggestedTrainings"
            onChange={handleChange}
            rows="10"
            required
            disabled= {isMananger}
          ></textarea>
        </div>
        <div className="form-group full-width">
          <button type="submit" className="submit-btn">
            Submit Appraisal
          </button>
        </div>
      </form>
    </div>
  );

}

export default AppraisalForm;