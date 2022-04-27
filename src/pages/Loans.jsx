import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Tabs, Tab, Row, Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import { ButtonGroup, Classes, Button } from "@blueprintjs/core";
import Config from "../config";

const Loans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios.get('https://app.lendcube.ca/api/v1/loans?page=' + page + "&search=" + query, Config).then((resp) => {
      setData(resp.data.loans);
      setPagination(resp.data.pagination);
      setLoading(false);
    });
    
  }, [page, query]);

  const nextPage = () => {
    setPage(page + 1);
  }

  const prevPage = () => {
    setPage(page - 1);
  }

  const ExpandedComponent = ({ data }) => {
    return(
      <div className="pt-2" style={{float:'left'}}>
        <Tabs
          defaultActiveKey="address"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="address" title="Address Details">
            <div style={{textAlign: 'left', marginLeft: '20px' }}>
              <h3>Address:</h3>
              <p>{JSON.stringify(data)}</p>    
            </div>
          </Tab>
          <Tab eventKey="settings" title="Settings">
            <div style={{textAlign: 'left', marginLeft: '20px' }}>
              <h3>Configuration: </h3>
              <p>{JSON.stringify(data)}</p>    
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }

  const columns = [
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', selector: row => row.customer_email, sortable: true },
    { name: 'Country', selector: row => row.country, sortable: true },
    { name: 'Amount', selector: row => `$${row.amount}`, sortable: true },
    { name: 'Created', selector: row => `${Moment(row.created_at).format("L LT")}`, sortable: true }
  ];

  return(
    <Container className="pt-4 pb-4">
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''}>Loans</Card.Header>
        
        <Card.Body>
          <Row>
            <Col>
              <div style={{float: 'left', textAlign: 'left'}}>
                <p className={`${loading ? Classes.SKELETON : ''}`}>
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
          <div className={loading ? Classes.SKELETON : ''}>
            <DataTable
              columns={columns}
              data={data}
              selectableRows
              dense
              expandableRows
              expandableRowsComponent={ExpandedComponent}
          />
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
};

export default Loans;