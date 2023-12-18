import { Button, Classes, Dialog, Position, Toaster } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, FormSelect, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import DetailField from "../../components/DetailField";
import Layout from "../../components/Layout";
import moment from "moment";

const BREADCRUMBS = [{ href: "/users", icon: "folder-close", text: "Users" }];

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const Users = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }}

  const formatMoney = (loans) => {
    const amount = loans?.map(d => d.amount)?.length > 0 ? loans?.map(d => d.amount)?.reduce((a, b) => a + b) : 0;
    
    return(
      <div style={{display: 'flex'}}>
        <CurrencyFormat value={amount} displayType={'text'} decimalScale="2" fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
        <span style={{marginLeft: 5}}> - ({loans?.length})</span>
      </div> 
    )
  }

  const getUser = (id) => {
    axios.get(process.env.REACT_APP_API_URL + "users/" + id, authHeader).then((resp) => {
      setUser(resp.data);
      setDialogOpen(true);
    }).catch((e) => {
      AppToaster.show({ message: 'User retrieval failed, please try again later.', intent: 'danger' });
    })
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => getUser(row.id) } />, sortable: false },
    { name: 'ID', width: '60px', selector: row => `${row.id}`, sortable: true },
    { name: 'Email', width: '200px', selector: row => row.email, sortable: true },
    { name: 'Total Loans', width: '180px', selector: row => formatMoney(row.loans), sortable: false },
    { name: 'Stores', width: '250px', selector: row => row.stores.map(s => s.name).join(", "), sortable: false },
    { name: 'Role', width: '220px', selector: row => renderRoleSelect(row), sortable: false, minWidth: 220 },
    { name: 'Created At', width: '200px', selector: row => moment(row.created_at).format("LLL"), sortable: true }
  ]

  useEffect(() => {
    if(localStorage?.token?.length > 5){
      if(localStorage?.current_user_role === 'admin'){
        updateTable();
      } else {
        navigate("/")
      }
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTable = () => {
    axios.get(process.env.REACT_APP_API_URL + "users", authHeader).then((resp) => {
      setData(resp.data.users);
    }).catch((e) => {
      console.log("ERROR: ", e)
    })
  }

  const setNewRole = (e) => {
    const userId = e.target.parentElement.parentElement.id.split("-")[2];
    axios.post(process.env.REACT_APP_API_URL + "users/" + userId + "/update_role", { new_role: e.target.value }, authHeader).then((resp) => {
      if(resp.data.code === 'SUCCESS'){
        AppToaster.show({ message: 'Role update successful', intent: 'success' });
        updateTable();
      } else {
        AppToaster.show({ message: resp.data.error, intent: 'danger' })
      }
    })
  }

  const getCurrentRole = (user) => {
    if(user.admin)
      return "admin"
    if(user.manager)
      return "manager"
    if(user.accountant)
      return "accountant"
    if(user.employee)
      return "user"
  }
  
  const renderRoleSelect = (user) => {
    return (
      <FormSelect style={{width: '100%'}} onChange={(e) => setNewRole(e)} value={getCurrentRole(user)}>
        <option value="admin">Administrator</option>
        <option value="manager">Manager</option>
        <option value="accountant">Accountant</option>
        <option value="user">Employee</option>
      </FormSelect>
    )
  }

  let layoutActions = []
  if(localStorage.current_user_role === 'admin'){
    layoutActions = [
      { id: 1, intent: 'success', label: 'Create New User', func: () => navigate("/users/new") }
    ]
  }
  

  return (
    <Layout
      showBreadcrumbs={true} 
      breadcrumbs={BREADCRUMBS}
      actions={layoutActions}>
        <Card.Body>
          <div className={loadingData ? Classes.SKELETON : ''}>
            <DataTable
              columns={columns}
              data={data}
              selectableRows
              pagination
            />
          </div>
        </Card.Body>
        <Dialog isOpen={dialogOpen} title="User Details" isCloseButtonShown={true} onClose={() => setDialogOpen(false)} usePortal={true} icon={"inherited-group"}>
          <Row style={{textAlign: 'left'}}>
            <Col>
              <DetailField field="User ID" value={user.id} />
              <DetailField field="Customer Email" value={user.email} />
              <DetailField field="Loan Stats" value={formatMoney(user.loans)} />
            </Col>
          </Row>
        </Dialog>
    </Layout>
  )
}

export default Users;