import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import DetailField from "../components/DetailField";
import Layout from "../components/Layout";
import { Button, Divider } from "@blueprintjs/core";
import CurrencyFormat from "react-currency-format";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";

const Account = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
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

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => navigate("/loans/" + row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `${row.id}`, sortable: false },
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', width: '250px', selector: row => row.customer_email, sortable: true },
    { name: 'Country', width: '100px', selector: row => row.country, sortable: true },
    { name: 'Amount', width: '120px', selector: row => <CurrencyFormat value={row.amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />, sortable: false },
    { name: 'Frequency', width: '110px', selector: row => row.frequency, sortable: true },
    { name: 'Created', width: '170px', selector: row => `${moment(row.created_at).format("L LT")}`, sortable: true }
  ];

  const layoutActions = [
    { id: 1, intent: 'warning', label: 'Change Password', func: () => console.log("Forgot Password") },
    { id: 2, intent: 'success', label: 'Show Loans', func: () => console.log("Show Loans") }
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
      <br/>
      <Divider />
      <br/>
      <h3 style={{textAlign: 'left'}}>My Created Loans: </h3>
      <Row>
        <Col>
          <DataTable
            columns={columns}
            data={user?.loans}
            selectableRows
            pagination
          />
        </Col>
      </Row>
    </Layout>
  )
}

export default Account;