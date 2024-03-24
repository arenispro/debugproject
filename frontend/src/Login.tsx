// SURAIYA KHOJA
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

/*
  Login page.
  https://www.youtube.com/watch?v=sBw0O5YTT4Q
  https://www.youtube.com/watch?v=jwEbw0zJqiY
  Retrieves login data entered by the user. Sends data to the backend via HTTP requests. Handles the response 
  from the backend by displaying the messages. 
*/
const Login: React.FC = () => {
  // Store username and password into variables as they type. Also stores the error message into a variable to render to user.
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  /*
    Receives username and password from user and sends it to the backend to handle. 
    Given the response from the backend, renders the appropriate message to the screen. 
  */
  const handleLogin = async () => {
    try {
      console.log("Sending login request:", { username, password });
      console.log("Username: ", username);
      console.log("Password: ", password);
      const response = await fetch("http://127.0.0.1:5000/login", {
        // request to backend with specific parameters
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      console.log("Received login response:", response);
      if (response.ok) {
        // handle successful response by navigating to the dashboard
        // Successful login
        localStorage.setItem("isLoggedIn", "true");
        console.log("Login successful");
        navigate("/dashboard");
      } else {
        // handle unsuccessful response by setting error message to be rendered
        // Failed login
        console.log("Login failed");
        const errorMessage = await response.json();
        setError(errorMessage.message);
        //setErrora('Invalid username or password');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*
    Render the following to the screen. Places username and password into variables and handles click on login. If the login is
    unsuccessful, renders the error message to the screen.
    Button to register if user does not have an account navigates to the registration page. 
  */
  return (
    <div className="login-page">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />

      <div className="login-container">
        <h1>Smart Stock</h1>
        <div className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // As user types username, store into variable
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // As user types password, store into variable
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
