import React, { useEffect, useState } from "react";
import { Classes, Button } from "@blueprintjs/core";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import moment from "moment";
import DetailField from "../components/DetailField";


const Loan = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [loan, setLoan] = useState({});
  const navigate = useNavigate();
  
  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    if(localStorage?.token?.length > 5){
      axios.get(process.env.REACT_APP_API_URL + 'loans/' + id, authHeader).then((resp) => {
        setLoan(resp.data);
        setLoading(false);
      }).catch((e) => {
        navigate("/login");
      });
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="pt-4 pb-4 loanInfo">
      <Card className="boxshadowhover">
        <Card.Header align="start" className={`${loading ? Classes.SKELETON : ''}`} style={{height: 48}}>
          <div style={{float: 'left'}}>
            {`#0000${loan?.id}`}
          </div>
          <div style={{float: 'right'}}>
            <Button intent="success" onClick={() => navigate(`/loans/${loan?.id}/bankdetails`) }>Add Bank Details</Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm="3">
              <div className={`${loading ? Classes.SKELETON : ''} money-preview`}>
                <h4>$ {loan?.amount}</h4>
                <small>Rate: {loan?.selected_rate}%</small><br/>
                <small>{loan?.frequency}</small>
              </div>
            </Col>
            <Col className="details-section">
              <h3 className={loading ? Classes.SKELETON : ''}>Details:</h3>
              <Row>
                <Col sm={6}>
                  <DetailField loading={loading} field="Customer Email" value={loan.customer_email} />
                  <DetailField loading={loading} field="Full Name/DOB" value={`${loan?.first_name} ${loan?.last_name} - ${moment(loan?.dob).format("LL")}`} />
                  <DetailField loading={loading} field="Phone #" value={loan.customer_phone} />
                  <DetailField loading={loading} field="Service Use" value={loan.service_use} />
                  <DetailField loading={loading} field="Created" value={moment(loan?.created_at).format("LLL")} />
                  <DetailField loading={loading} field="Created By" value={loan.created_by?.email} />
                </Col>
                <Col>
                  <DetailField loading={loading} field="Address 1" value={loan.address1} />
                  <DetailField loading={loading} field="Address 2" value={loan.address2} />
                  <DetailField loading={loading} field="City" value={loan.city} />
                  <DetailField loading={loading} field="Postal Code" value={loan.postalcode} />
                  <DetailField loading={loading} field="Province" value={loan.province} />
                  <DetailField loading={loading} field="Canada" value={loan.country} />
                </Col>
              </Row>
            </Col>
          </Row>
          
          <br/>

          <Row>
            <Col lg={8} className="details-section">
              <h4 className={loading ? Classes.SKELETON : ''}>Financial Details: </h4>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Institution #: </strong>{loan?.financial_institution_number}
              </p>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Institution Name: </strong>{loan?.financial_institution_name}
              </p>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Institution Branch Address: </strong>{loan?.financial_institution_branch_address}
              </p>
            </Col>
            <Col className="details-section">
              <div className={loading ? Classes.SKELETON : ''} style={{minHeight: '35px'}}></div>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Deposit Account #: </strong>{loan?.deposit_account_number}
              </p>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Transit #: </strong>{loan?.branch_transit_number}
              </p>
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>Account Type: </strong>{loan?.account_type}
              </p>
            </Col>
          </Row>

          <br/>

        </Card.Body>
      </Card>
    </Container>
  )
}

export default Loan;