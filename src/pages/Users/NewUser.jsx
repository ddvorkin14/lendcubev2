import { Classes, Position, Toaster } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const NewUser = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const formRef = useRef(null);
  
  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  const BREADCRUMBS = [
    { href: "/users", icon: "folder-close", text: "Users" },
    { href: "/users/new", icon: "new-person", text: "New User" }
  ];
  
  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  
    return password;
  };

  useEffect(() => {
    setUser({ ...user, password: generatePassword() });
    setLoading(false);
  }, [])

  const fieldUpdate = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const createUser = () => {
    axios.post(process.env.REACT_APP_API_URL + "users", user, authHeader).then((resp) => {
      if(resp?.data?.code === 200){
        AppToaster.show({ message: 'User created successfully', intent: 'success' });
        navigate("/users");
      } else {
        AppToaster.show({ message: 'User was not created successfully', intent: 'danger' })
      }
    })
  }

  useEffect(() => {
    if (formRef.current) {
      const isFormValid = formRef.current.checkValidity();
      setValidated(isFormValid);
    }
  }, [user]);

  return (
    <Layout
      showBreadcrumbs={true} 
      breadcrumbs={BREADCRUMBS}
      actions={[]}>
        <Card.Body>
          <div className={loading ? Classes.SKELETON : ''}>
            <Row>
              <Col lg={5}>
                <Form ref={formRef} onSubmit={createUser} validated={validated} noValidate>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ float: 'left' }}>Email address</Form.Label>
                    <Form.Control required type="email" name="email" id="email" onChange={fieldUpdate} value={user?.email} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ float: 'left' }}>First Name</Form.Label>
                    <Form.Control required type="text" name="first_name" id="first_name" onChange={fieldUpdate} value={user?.first_name} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ float: 'left' }}>Last Name</Form.Label>
                    <Form.Control required type="text" name="last_name" id="last_name" onChange={fieldUpdate} value={user?.last_name} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ float: 'left' }}>Password (randomly generated)</Form.Label>
                    <Form.Control required type="password" name="password" id="password" value={user?.password} disabled={true}/>
                  </Form.Group>

                  <Button style={{width: '100%'}} variant="success" type="submit" disabled={!validated}>Create User</Button>
                </Form>

              </Col>
            </Row>
          </div>
        </Card.Body>
    </Layout>
  )
}

export default NewUser;