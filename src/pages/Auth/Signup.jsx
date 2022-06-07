import axios from "axios";
import React, { useState } from "react";
import { Container } from "react-bootstrap";

const Signup = () => {
  const [newUser, setNewUser] = useState();

  const onSubmit = (event) => {
    event.preventDefault();
    
    axios.post(process.env.REACT_APP_API_URL + 'signup', { user: newUser }).then((resp) => {
      debugger;
    });
  }

  return(
    <Container className="pt-4 mt-4">
      <form onSubmit={(e) => onSubmit(e)} className="login-form">
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label style={{textAlign: 'left'}}>Email address</label>
          <input
            onChange={(e) => setNewUser({...newUser, [e.target.name]: e.target.value})}
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label style={{textAlign: 'left'}}>Password</label>
          <input
            onChange={(e) => setNewUser({...newUser, [e.target.name]: e.target.value})}
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        
        <div className="mb-3">
          <label style={{textAlign: 'left'}}>Password Confirmation</label>
          <input
            onChange={(e) => setNewUser({...newUser, [e.target.name]: e.target.value})}
            type="password"
            name="password_confirmation"
            className="form-control"
            placeholder="Enter password confirmation"
          />
        </div>
        
        <div className="d-grid">
          <button type="submit" className="btn btn-secondary">
            Register
          </button>
        </div>
      </form>
        
    </Container>
  )
}

export default Signup;