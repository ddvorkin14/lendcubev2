import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import DetailField from "../components/DetailField";
import Layout from "../components/Layout";

const Account = () => {
  const [user, setUser] = useState({});
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

  const layoutActions = [
    { id: 1, intent: 'warning', label: 'Change Password', func: () => console.log("Forgot Password")}
  ]

  return(
    <Layout showBreadcrumbs={false} headerTitle="Account Details" actions={layoutActions} loading={false}>
      <Row>
        <Col lg={5}>
          <Row>
            <Col lg={12}><DetailField loading={false} field="Email" value={user?.email} /></Col>
            <Col lg={12}><DetailField loading={false} field="Role" value={localStorage?.current_user_role} /></Col>
          </Row>
        </Col>
      </Row>
      
    </Layout>
  )
}

export default Account;