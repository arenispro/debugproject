// Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Username: ", username);
      console.log("Password: ", password);
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        // Successful login
        navigate("/dashboard");
      } else {
        // Failed login
        const errorMessage = await response.json();
        setError(errorMessage.message);
        //setError('Invalid username or password');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-page">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />

      <div className="login-container">
        <h1>Smart Stock</h1>
        <div className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
          {error && <div className=".login-error-message">{error}</div>}
          <p>
            Don't have an account? <Link to="/register">Sign up!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
