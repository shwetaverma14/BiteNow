import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../screens/background.png';
import styles from './Signup.module.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();
    console.log(json);
  
    if (!json.success) {
      alert("Enter Valid Credentials");
    }
    if (json.success) {
      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userEmail", credentials.email); // Store user's email
      console.log("User email stored in localStorage:", credentials.email); // Debug log
      navigate("/");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div
        className={`${styles.container} d-flex justify-content-center align-items-center`}
        style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={`p-5 w-40px bg-light shadow rounded text-dark ${styles.formContainer}`}>
          <h1 className='text-center text-color-black'>Login</h1>
          <form onSubmit={handleSubmit}>
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
              />
            </div>

            <button type="submit" className="m-3 btn btn-success">Submit</button>
            <Link to="/createuser" className='m-3 btn btn-danger'>New User</Link>
          </form>
        </div>
      </div>
    </>
  );
}