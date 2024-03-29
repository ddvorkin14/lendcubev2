import React from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Position, Toaster } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    const [email, password] = event.target.elements;
    const headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }
    
    axios.post(process.env.REACT_APP_API_URL + 'login', { "email": email.value, "password": password.value, headers: headers }).then((resp) => {
      if(resp.data?.access_token){
        localStorage.current_user_role = resp.data?.role;
        localStorage.token = resp.data?.access_token;
        AppToaster.show({ message: "Login successful, welcome " + resp.data?.email, intent: 'success' });
        navigate("/loans")
      } else {
        AppToaster.show({ message: resp.data.error, intent: 'danger' });
      }
    })
  }

  return (
    <Container className="pt-4 mt-4">
      <form onSubmit={(e) => onSubmit(e)} className="login-form">
        <h3>Sign In</h3>
        <div className="mb-3">
          <label style={{float: 'left'}}>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label style={{float: 'left'}}>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>

      <div className="d-grid mt-3">
        <button onClick={() => navigate("/forgot_password")} className="btn btn-warning login-form">
          Forgot Password
        </button>
      </div>
        
    </Container>
  )
}

export default Login;