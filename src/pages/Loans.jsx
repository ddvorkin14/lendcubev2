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
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    if(localStorage?.token?.length > 10){
      axios.get('https://app.lendcube.ca/api/v1/loans?page=' + page + "&search=" + query, authHeader).then((resp) => {
        setData(resp.data.loans);
        setPagination(resp.data.pagination);
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
  }, [page, query]);

  const nextPage = () => {
    setDataLoading(true);
    setPage(page + 1);
  }

  const prevPage = () => {
    setDataLoading(true);
    setPage(page - 1);
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => navigate("/loans/" + row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `0000${row.id}`, sortable: false },
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', width: '250px', selector: row => row.customer_email, sortable: true },
    { name: 'Country', width: '100px', selector: row => row.country, sortable: true },
    { name: 'Amount', width: '120px', selector: row => <CurrencyFormat value={row.amount} displayType={'text'} decimalScale="2" fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />, sortable: false },
    { name: 'Frequency', width: '110px', selector: row => row.frequency, sortable: true },
    { name: 'Created', selector: row => `${Moment(row.created_at).format("L LT")}`, sortable: true }
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
            <Col>
              <div style={{float: 'left', textAlign: 'left'}}>
                <p className={`${dataLoading ? Classes.SKELETON : ''}`}>
                  Total Records: {pagination?.total_entries}
                  <br/>
                  Current Page: {pagination?.current_page}
                </p>
              </div>
            </Col>

            <Col>
              <input className={loading ? Classes.SKELETON : ''} type="text" value={query} placeholder="Search...." onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
                setDataLoading(true);
              }} />
            </Col>

            <Col>
              <div style={{float: 'right'}}>
                <ButtonGroup minimal={false}>
                  <Button className={`${loading ? Classes.SKELETON : ''} mr-2`} disabled={page === 1} onClick={() => prevPage()}>Previous</Button>
                  <Button className={loading ? Classes.SKELETON : ''} disabled={data.length < pagination.per_page} onClick={() => nextPage()}>Next</Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
          
        </Card.Body>

        <Card.Body>
          <div className={dataLoading ? Classes.SKELETON : ''}>
            <DataTable
              columns={columns}
              data={data}
              selectableRows
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