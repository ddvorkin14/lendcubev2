import { Button, Classes, Dialog, Position, Toaster } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import DetailField from "../components/DetailField";
import Layout from "../components/Layout";

const BREADCRUMBS = [
  { href: "/users", icon: "folder-close", text: "Users" }
];

const authHeader = {
  headers: {
    'Authorization': `Bearer ${localStorage.token}`
  }
}

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const formatMoney = (loans) => {
    const amount = loans.map(d => d.amount).reduce((a, b) => a + b);
    
    return(
      <div style={{display: 'flex'}}>
        <CurrencyFormat value={amount} displayType={'text'} decimalScale="2" fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
        <span style={{marginLeft: 5}}> - ({loans.length})</span>
      </div> 
    )
  }

  const getUser = (id) => {
    setLoading(true);
    axios.get(process.env.REACT_APP_API_URL + "users/" + id, authHeader).then((resp) => {
      setUser(resp.data);
      setDialogOpen(true);
    }).catch((e) => {
      AppToaster.show({ message: 'User retrieval failed, please try again later.', intent: 'danger' });
    })
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => getUser(row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `${row.id}`, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Total Loans', selector: row => formatMoney(row.loans), sortable: false },
    { name: 'Stores', selector: row => row.stores.map(s => s.name).join(", "), sortable: false },
    { name: 'Created At', selector: row => row.created_at, sortable: true }
  ]

  useEffect(() => {
    if(localStorage?.token?.length > 5){
      axios.get(process.env.REACT_APP_API_URL + "users", authHeader).then((resp) => {
        setData(resp.data.users);
        setLoading(false);
      }).catch((e) => {
        console.log("ERROR: ", e)
      })
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      showBreadcrumbs={true} 
      breadcrumbs={BREADCRUMBS}
      actions={[]}>
        <Row>
          <Col lg={4}>
            <input style={{width: '100%'}} type="search" className={loading ? Classes.SKELETON : ''} value={query} placeholder="Search for a User...." onChange={(e) => {
              setQuery(e.target.value);
              setLoadingData(true);
            }} />
          </Col>
        </Row>

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
              <DetailField field="Loan Stats" value={user.loans?.map((l) => l.amount).reduce((a,b) => a + b)} />
            </Col>
          </Row>
        </Dialog>
    </Layout>
  )
}

export default Users;