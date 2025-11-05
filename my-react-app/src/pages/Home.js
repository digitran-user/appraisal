

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/reportees/${password}`);
     const data = await res.json();
     localStorage.setItem("employees", JSON.stringify(data));
      if (res.status===404) {
      navigate(`/appraisal?q=${password}&z=self`); // route after login
    } else {
      navigate(`/reportee?id=${password}`);
    }
  };

  return (
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
    </div>
  );
  
}
export default Home;

