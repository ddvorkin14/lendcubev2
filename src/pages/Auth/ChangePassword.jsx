import { Icon, Position, Toaster } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const ChangePassword = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "users/" + localStorage.token?.split(":")[0], authHeader).then((resp) => {
      setUser(resp.data);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    axios.post(process.env.REACT_APP_API_URL + "users/" + user?.id + "/change_password", { email: user?.email, password: user?.password }, authHeader).then((resp) => {
      if(resp?.data?.code === 200){
        AppToaster.show({ message: "Password updated successfully", intent: 'success' });
        navigate("/account");
      } else {
        AppToaster.show({ message: "Password not updated. Please contact an Administrator for assistance.", intent: 'danger' });
      }
    })
  }

  const passwordValidation = () => {
    return !(user && user.password && user.password === user.passwordConfirmation)
  }

  return (
    <Layout showBreadcrumbs={false} headerTitle="Account Details" actions={[]} loading={false}>
      <Row>
        <Col lg={5}>
          <Form>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label style={{ float: 'left' }}>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" value={user?.email} disabled={true} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label style={{ float: 'left' }}>Password</Form.Label>
              <InputGroup>
                <Form.Control tabIndex="1" type={showPassword ? 'text' : "password"} placeholder="" value={user?.password} onChange={(e) => setUser({...user, password: e.target.value })}/>
                <Button variant={"secondary"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Icon icon="eye-off" />
                  ) : (
                    <Icon icon="eye-open" />
                  )}
                  
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordConfirmation">
              <Form.Label style={{ float: 'left' }}>Password Confirmation</Form.Label>
              <InputGroup>
                <Form.Control tabIndex="2" type={showPassword ? 'text' : "password"} placeholder="" value={user?.passwordConfirmation} onChange={(e) => setUser({...user, passwordConfirmation: e.target.value })}/>
                <Button variant={"secondary"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Icon icon="eye-off" />
                  ) : (
                    <Icon icon="eye-open" />
                  )}
                  
                </Button>
              </InputGroup>
            </Form.Group>
            
            <small>Password and Password Confirmation must match</small>
            <Button style={{float: 'left' }} onClick={submit} disabled={passwordValidation()}>Change Password</Button>
          </Form>
        </Col>
      </Row>
    </Layout>
  )
}

export default ChangePassword;