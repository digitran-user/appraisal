
import './App.css';
import React, {useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navigate  } from "react-router-dom";
import Home from "./pages/Home";
import ReporteeList from "./pages/ReporteeList";
import AppraisalForm from "./pages/AppraisalForm";
import ReporteeAppraisal from "./pages/ReporteeAppraisal";
import { useNavigate } from "react-router-dom";

function App() {

  return (
 <>
   
      <Routes>
         <Route path="/" element={<Home />} />
        <Route path="/appraisal" element={<AppraisalForm />} />
        <Route path="/reporteeappraisal" element={<ReporteeAppraisal />} />
        <Route path="/reportee" element={<ReporteeList />} />
      </Routes>
  </>
  );
}

export default App;
