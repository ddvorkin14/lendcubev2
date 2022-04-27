import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Table, Button } from "react-bootstrap";

const Loans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    var config = {
      responseType: 'json',
      format: 'json',
      auth: {
        username: 'dvorkin212@gmail.com',
        password: 'passwordA1'
      }
    }
    axios.get('https://app.lendcube.ca/api/v1/loans?page=' + page, config).then((resp) => {
      setData(resp.data.loans);
      setPagination(resp.data.pagination);
      setLoading(false);
    });
    
  }, [page]);

  const nextPage = () => {
    setPage(page + 1);
  }

  const prevPage = () => {
    setPage(page - 1);
  }

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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data.map((d) => {
                return(        
                  <tr>
                    <td>{d.id}</td>
                    <td>{d.first_name}</td>
                    <td>{d.last_name}</td>
                    <td>{d.customer_email}</td>
                    <td>{d.created_by.email}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
};

export default Loans;