import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { Position, Toaster } from "@blueprintjs/core";


const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 3
});

const ForgotPassword = () => {
  const [user, setUser] = useState({});
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!!autoLogin) {
      let { email, password } = user;
      const headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
      
      axios.post(process.env.REACT_APP_API_URL + 'login', { "email": email, "password": password, headers: headers }).then((resp) => {
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
  }, [autoLogin])

  const setNewPassword = () => {
    let authHeader = { headers: { 'Authorization': `Bearer ${user?.access_token}` } };
    
    axios.post(process.env.REACT_APP_API_URL + "users/" + user?.id + "/change_password", { email: user?.email, password: user?.password }, authHeader).then((resp) => {
      if(resp?.data?.code === 200){
        AppToaster.show({ message: "Password updated successfully", intent: 'success' });
        setAutoLogin(true);
      } else {
        AppToaster.show({ message: "Password not updated. Please contact an Administrator for assistance.", intent: 'danger' });
      }
    })
  }

  const findUser = () => {
    let config = { method: 'get', url: process.env.REACT_APP_API_URL + "users/find_user?email=" + user?.email }
    console.log("User: ", user);
    axios.request(config).then((resp) => {
      if(resp?.data?.user){
        setUser(resp?.data?.user);
        AppToaster.show({ message: "User found! You can now reset your password"})
      } else {
        AppToaster.show({ message: "User not found. Please try again. ", intent: 'danger' })
      }
    })
  }

  return (
    <Container className="pt-4 mt-4">
      <div className="login-form">
        <h3>Forgot Password</h3>
        <div className="mb-3">
          <label style={{float: 'left'}}>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        
        {!!user.id && (
          <>
            <div className="mb-3">
              <label style={{float: 'left'}}>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => setUser({...user, password: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label style={{float: 'left'}}>Password Confirmation</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password confirmation"
                onChange={(e) => setUser({...user, passwordConfirmation: e.target.value })}
              />
            </div>
          </>
        )}
        
        {!!user.id ? (
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" onClick={() => setNewPassword()}>
              Set New Password
            </button>
          </div>
        ) : (
          <div className="d-grid">
            <button className="btn btn-primary" onClick={() => findUser()}>
              Find User
            </button>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ForgotPassword;