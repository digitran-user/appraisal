

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
function Home() {
  const [email, setEmail] = useState("");
  const [employee,setEmployee] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

     const res = await fetch(`http://13.203.205.146:5000/api/emp/${email}`);
     const data = await res.json();
     const correcPassword = data.empID + data.doj;
     //debugger;
     if(res.status === 404){
       setError(data.message);
     }if(correcPassword === password){
        navigate(`/landing?q=${email}&z=self`);
     }else{
        setError("Incorrect credentials");
     }
   
  };
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


  return (
<>
<img src={logo} alt="Logo" className="logo" onClick={() => navigate('/')} />
    <div style={styles.container}>
      <h2>Complete your Appraisal</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Enter EMP ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {error && <div style={{color:"red", marginTop:"10px"}}>{error}</div>}
    </div> </>
  );
  
}
export default Home;

