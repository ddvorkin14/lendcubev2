import React, { useState } from "react";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();
    const [email, password] = event.target.elements;
    const headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }
    axios.post('https://app.lendcube.ca/api/v1/login', { "email": email.value, "password": password.value, headers: headers }).then((resp) => {
      if(resp.data?.access_token){
        localStorage.token = resp.data?.access_token;
        navigate("/loans")
      } else {
        setErrors(resp.data.error)
      }
    })
  }

  return (
    <Container className="pt-4 mt-4">
      <form onSubmit={(e) => onSubmit(e)} className="login-form">
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        {errors && (
          <p>{errors}</p>
        )}
        
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
        
    </Container>
  )
}

export default Login;