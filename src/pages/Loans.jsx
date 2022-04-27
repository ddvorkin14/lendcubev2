import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Table, Button, Tabs, Tab } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Moment from 'moment';

const Loans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    var config = {
      responseType: 'json',
      format: 'json',
      auth: {
        username: 'dvorkin212@gmail.com',
        password: 'passwordA1'
      }
    }
    axios.get('https://app.lendcube.ca/api/v1/loans?page=' + page + "&search=" + query, config).then((resp) => {
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
        {loading && (
          <p>Loading Data</p>
        )}
        <Card.Header align="start">Loans</Card.Header>
        <Card.Body>
          <div style={{display: 'flex', float: 'left'}}>
            <p className="pl-2">Total Records: {pagination?.total_entries}</p>
          </div>
          <div style={{display: 'flex', float: 'right'}}>
            <p className="pr-2">Current Page: {pagination?.current_page}</p>
          </div>
        </Card.Body>
        <Card.Body>
          <div style={{display: 'flex', float: 'left'}}>
            <Button disabled={page === 1} onClick={() => prevPage()}>Previous</Button>
          </div>
          
          <div style={{display: 'flex', float: 'right'}}>
            <Button disabled={data.length < pagination.per_page} onClick={() => nextPage()}>Next</Button>
          </div>
        </Card.Body>
        <Card.Body>

          <input type="text" value={query} onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }} />
        </Card.Body>
        <Card.Body>
          <DataTable
            columns={columns}
            data={data}
            selectableRows
            dense
            expandableRows
            expandableRowsComponent={ExpandedComponent}
        />
        </Card.Body>
      </Card>
    </Container>
  )
};

export default Loans;