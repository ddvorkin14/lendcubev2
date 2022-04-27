import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import { ButtonGroup, Classes, Button, Breadcrumbs } from "@blueprintjs/core";
import Config from "../config";
import { useNavigate } from "react-router-dom";
import ExpandedComponent from "../components/ExpandedTableArea";

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

  useEffect(() => {
    axios.get('https://app.lendcube.ca/api/v1/loans?page=' + page + "&search=" + query, Config).then((resp) => {
      setData(resp.data.loans);
      setPagination(resp.data.pagination);
      setLoading(false);
      setDataLoading(false);
    });
    
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
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', selector: row => row.customer_email, sortable: true },
    { name: 'Country', selector: row => row.country, sortable: true },
    { name: 'Amount', selector: row => `$${row.amount}`, sortable: true },
    { name: 'Frequency', selector: row => row.frequency, sortable: true },
    { name: 'Created', selector: row => `${Moment(row.created_at).format("L LT")}`, sortable: true },
    { name: 'Actions', selector: row => <Button minimal={true} icon="eye-open" onClick={() => navigate("/loans/" + row.id) } />, sortable: false }
  ];


  return(
    <Container className="pt-4 pb-4">
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''}>
          <Breadcrumbs items={BREADCRUMBS} />
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