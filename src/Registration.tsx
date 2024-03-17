// SURAIYA KHOJA
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

/*
  Registration page.
  Retrieves registration data entered by the user. Sends data to the backend via HTTP requests. Handles the response 
  from the backend by displaying the messages. 
*/
const Registration: React.FC = () => {
  // Store data into variables as they type. Also stores the error message into a variable to render to user.
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmedPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      // console logging for debugging
      console.log("First Name: ", firstName);
      console.log("Last Name: ", lastName);
      console.log("Email: ", email);
      console.log("Username: ", username);
      console.log("Password: ", password);
      console.log("Confirm Password: ", confirmPassword);
      console.log("Address:", address);
      console.log("Role:", role);

      // Verify that password and confirmPassword are the same. If not set the error message to be displayed.
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Verify that all required boxes have been filled. If not set the error message to be displayed.
      if (
        firstName == "" ||
        lastName == "" ||
        email == "" ||
        username == "" ||
        password == "" ||
        confirmPassword == "" ||
        address == "" ||
        role == ""
      ) {
        setError("Please complete the required boxes.");
        return;
      }

      /* TRYING TO DO API REQUEST FOR EMAIL VERIFICATION BUT FAILED FOR NOW?
      const emailValidationResponse = await fetch('http://127.0.0.1:5000/email_validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (emailValidationResponse.ok) {
        const validationData = await emailValidationResponse.json();
        console.log(validationData. is_valid_format.value)
        console.log(validationData.is_free_email.value)
        console.log(!validationData.is_disposable_email.value)
        console.log(!validationData.is_role_email.value)
        console.log(validationData.is_mx_found.value)
        console.log(validationData.is_smtp_valid.value)
        if (
          validationData.is_valid_format.value &&
          validationData.is_free_email.value &&
          !validationData.is_disposable_email.value &&
          !validationData.is_role_email.value &&
          validationData.is_mx_found.value &&
          validationData.is_smtp_valid.value
        )  {
          */

      // Send the information to the backend to process. If the registration is successful, navigate to login. If not, display error.
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          confirmPassword,
          address,
          role,
        }), // Information to send
      });

      if (response.ok) {
        // Navigate to login if backend response is successful
        navigate("/");
      } else {
        // Set error message to be rendered to screen if backend returns unsuccessful
        const errorMessage = await response.json();
        setError(errorMessage.message);
        //console.log(errorMessage)
      }
      /* MORE EMAIL VERIFICATION THAT DIDN'T WORK. 
        } else {
          // Email is invalid
          setError("Invalid email address.");
          return;
        }
      } else {
        setError("Error with email validation.");

      }
      */
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /*
    Render the following to the screen. Places account information into variables and handles click on registration. If the 
    registration is unsuccessful, renders the error message to the screen. 
  */
  return (
    <div className="registration-page">
      <img src="/smart_stock_logo;).png" className="logo" alt="logo" />
      <div className="registration-container">
        <h1>Get started</h1>
        <h2>Sign up to start inventorying today!</h2>
        <div className="registration-form">
          <input
            type="name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="username"
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <input
            type="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value=""> Select Role </option>
            <option value="Manager"> Manager </option>
            <option value="Boss"> Boss </option>
            <option value="Worker"> Worker </option>
          </select>

          <button onClick={handleRegistration}>Register</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Registration;
