import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import PerformanceRating from "./PerformanceRating";
import Objective from "./Objective";
import AssessmentTable from "./AssessmentTable";
import logo from '../assets/logo.png';

function LandingPage() {
  const location = useLocation();
 const navigate = useNavigate();
  //const [appraisal, setAppraisal] = useState({});
  const[management,setManagement] = useState(false);
  const[showButton,setShowButton] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [gradeObjectives, setGradeObjectives] = useState([]);
  const [gradeGoals, setGradeGoals] = useState([]);
  const [isManager, setIsManager] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [areas, setAreas] = useState([]);

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "14px"
  },
  button: {
    padding: "10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
const navigateToReportee = async () => {
navigate(`/reportee?id=${employee.empID}`);
};
const navigateToAppraisal = async () => {
    navigate(`/appraisal?q=${employee.empID}&z=self`);
};
const navigateToEmployees = async () => {
navigate(`/employeeList`);
};

const navigateToHome = async () => {
navigate(`/`);
};
  // ✅ Fetch employee
  const fetchEmployee = async (empId) => {
    try {
      const res = await fetch(`http://13.203.205.146:5000/api/emp/${empId}`);
      const data = await res.json();
      setEmployee(data);
      if(data.grade==="BS5" || data.grade=== "DIR"){
        setManagement(true);
      }
    //  fetchObjectives(data.grade);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }

    const res = await fetch(`http://13.203.205.146:5000/api/reportees/${empId}`);
    const data = await res.json();
    localStorage.setItem("employees", JSON.stringify(data));
     if (res.status===404) {
      setShowButton(false);
   } else {
     setShowButton(true);
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
<>
<img src={logo} alt="Logo" className="logo" onClick={() => navigate('/')} />
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
          <div style={{ marginTop: "20px" ,  display: "flex", justifyContent: "center" }}>
        <> {management && (<button  onClick={navigateToEmployees} type="submit" style={styles.button}>Employee List</button>)}
           <div className="spacerSmall" />
          {showButton && (<button  onClick={navigateToReportee} type="submit" style={styles.button}>Reportee List</button>)} </>
            <div className="spacerSmall" />
           <button  onClick={navigateToAppraisal} type="submit" style={styles.button}>Appraisal Form</button>
         <div className="spacerSmall" />
           <button  onClick={navigateToHome} type="submit" style={styles.button}>Logout</button>
        </div>
        </>
      )}
    </div> </>
  );
}

export default LandingPage;
