import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import backgroundImage from '../screens/background.png'; // Adjust the path based on your folder structure
import styles from './Signup.module.css'; // Import the CSS Module

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State to track error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to track success messages
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new submission
    setSuccessMessage(""); // Reset success message on new submission

    const response = await fetch('http://localhost:5000/api/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: credentials.name, 
        email: credentials.email, 
        password: credentials.password, 
        location: credentials.geolocation 
      })
    });

    const json = await response.json();
    console.log(json);

    if (!json.success) {
      if (json.message === "User already exists") {
        setErrorMessage("User already registered. Please log in."); // Set error message for existing user
      } else {
        setErrorMessage("Enter Valid Credentials"); // Set generic error message
      }
    } else {
      setSuccessMessage("Registration successful! Redirecting to Login page..."); // Set success message
      setErrorMessage(""); // Clear error message
      setCredentials({ name: "", email: "", password: "", geolocation: "" }); // Clear form fields

      // Redirect to Login page after 2 seconds
      setTimeout(() => {
        navigate("/login"); // Navigate to the Login page
      }, 2000);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.formContainer}`}>
          <h1 className="text-center text-dark">Signup</h1>

          {/* Display success message */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* Display error message */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                name='name' 
                value={credentials.name} 
                onChange={onChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                name='email' 
                value={credentials.email} 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                onChange={onChange} 
                required 
              />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                name='password' 
                value={credentials.password} 
                id="exampleInputPassword1" 
                onChange={onChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Address</label>
              <input 
                type="text" 
                className="form-control" 
                name='geolocation' 
                value={credentials.geolocation} 
                id="exampleInputPassword1" 
                onChange={onChange} 
                required 
              />
            </div>
            <button type="submit" className="m-3 btn btn-success">Submit</button>
            <Link to="/login" className='m-3 btn btn-danger'>Already a User</Link>
          </form>
        </div>
      </div>
    </>
  );
}