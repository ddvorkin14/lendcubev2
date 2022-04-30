import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import { ButtonGroup, Classes, Button, Breadcrumbs } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import ExpandedComponent from "../components/ExpandedTableArea";
import CurrencyFormat from "react-currency-format";

const BREADCRUMBS = [
  { href: "/loans", icon: "folder-close", text: "Loans" }
];

const Loans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    if(localStorage?.token?.length > 10){
      axios.get('https://app.lendcube.ca/api/v1/loans?search=' + query, authHeader).then((resp) => {
        setData(resp.data.loans);
        setLoading(false);
        setDataLoading(false);
      }).catch(function (error) {
        if(error.code === "ERR_BAD_REQUEST")
          localStorage.token = null;
          navigate("/login");
      });
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => navigate("/loans/" + row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `${row.id}`, sortable: false },
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', width: '250px', selector: row => row.customer_email, sortable: true },
    { name: 'Country', width: '100px', selector: row => row.country, sortable: true },
    { name: 'Amount', width: '120px', selector: row => <CurrencyFormat value={row.amount} displayType={'text'} decimalScale="2" fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />, sortable: false },
    { name: 'Frequency', width: '110px', selector: row => row.frequency, sortable: true },
    { name: 'Created', width: '170px', selector: row => `${Moment(row.created_at).format("L LT")}`, sortable: true }
  ];


  return(
    <Container className="pt-4 pb-4 loans-container">
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''} style={{height: 48}}>
          <div style={{float: 'left'}}>
            <Breadcrumbs items={BREADCRUMBS} />
          </div>
          <div style={{float: 'right'}}>
            <Button intent="success" onClick={() => navigate("/loans/new") }>Create New Loan</Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col lg={4}>
              <input style={{width: '100%'}} type="search" className={loading ? Classes.SKELETON : ''} value={query} placeholder="Search for a Loan...." onChange={(e) => {
                setQuery(e.target.value);
                setDataLoading(true);
              }} />
            </Col>
          </Row>
        </Card.Body>

        <Card.Body>
          <div className={dataLoading ? Classes.SKELETON : ''}>
            <DataTable
              columns={columns}
              data={data}
              selectableRows
              pagination
              // expandableRows
              expandableRowsComponent={ExpandedComponent}
          />
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
};

export default Loans;