import React, { useEffect, useState } from "react";
import { Classes, Button, Divider, Dialog, Toaster, Position } from "@blueprintjs/core";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
// import { init } from "lendcube-zumconnect";

import axios from "axios";
import moment from "moment";
import DetailField from "../components/DetailField";
import LoanPreview from "../components/LoanPreview";


const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const Loan = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [loan, setLoan] = useState({});
  const navigate = useNavigate();
  const [showZumConnect, setShowZumConnect] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  
  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    let loanCopy = {};
    if(localStorage?.token?.length > 5){
      axios.get(process.env.REACT_APP_API_URL + 'loans/' + id, authHeader).then((resp) => {
        setLoan(resp.data);
        loanCopy = resp.data;
        setLoading(false);
      }).catch((e) => {
        navigate("/login");
      });
    } else {
      navigate("/login");
    }

    window.addEventListener('message', function(e) {
      var data = e.data;
      if (data && data.origin && data.origin === 'ZUM_RAILS') {
        loanCopy['zum_customer_id'] = data.userId;

        axios.patch(process.env.REACT_APP_API_URL + "loans/" + id, { new_loan: loanCopy }, authHeader).then((resp) => {
          setLoan(resp.data.loan);
          setShowZumConnect(false);
          AppToaster.show({ message: "User has been successfully verified by ZumConnect", intent: 'success' });
        });
      } else if(e.data.step === 'GENERICERROR'){
        AppToaster.show({ message: "ZumConnect has reported back an error, please contact customer service for assistance", intent: 'danger' });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewPlan = (planId) => {
    axios.post(process.env.REACT_APP_API_URL + "loans/" + id + "/set_new_plan", {rule_id: planId}, authHeader).then((resp) => {
      setLoan(resp.data.loan);
    });
  }

  const zumConnect = () => {
    setShowZumConnect(true);
  }

  const url_params = `&firstName=${loan?.first_name}&lastName=${loan?.last_name}&email=${loan?.customer_email}&hideShippingAddress=true&displayTermsAndCondition=true&getstatements=true`

  const showImgPreview = (doc) => {
    setSelectedImg(doc);
    setImgModal(true);
  }

  return (
    <Container className="pt-4 pb-4 loanInfo">
      <Card className="boxshadowhover">
        <Card.Header align="start" className={`${loading ? Classes.SKELETON : ''}`} style={{height: 48}}>
          <div style={{float: 'left'}}>
            {`#0000${loan?.id}`}
          </div>
          <div style={{float: 'right'}}>
            <Button intent="success" onClick={() => navigate(`/loans/${loan?.id}/bankdetails`) }>Add Bank Details</Button>
            <Button intent="default" onClick={() => navigate(`/loans/${loan?.id}/edit`) } style={{marginLeft: 10}}>Edit Loan</Button>
            {loan?.zum_customer_id === 'N/A' && (
              <Button intent="warning" onClick={() => zumConnect()} style={{marginLeft: 10}}>Zum Connect</Button>
            )}
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
              <Row style={{marginTop: 20}}>
                <Col sm={6}>
                  <DetailField loading={loading} field="Customer Email" value={loan.customer_email} />
                  <DetailField loading={loading} field="Full Name/DOB" value={`${loan?.first_name} ${loan?.last_name} - ${moment(loan?.dob).format("LL")}`} />
                  <DetailField loading={loading} field="Phone #" value={loan.customer_phone} />
                  <DetailField loading={loading} field="Service Use" value={loan.service_use} />
                  <DetailField loading={loading} field="Start Date" value={moment(loan?.start_date).format("LL")} />
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
              <p className={loading ? Classes.SKELETON : ''}>
                <strong>ZUM ID: </strong>{loan?.zum_customer_id}
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

      <Divider/>
      <Card className="boxshadowhover">
        <Card.Header>Loan Preview</Card.Header>
        <Card.Body>
          <LoanPreview loading={loading} id={id} setNewPlan={setNewPlan}/>
        </Card.Body>
      </Card>

      <Divider/>
      <Card className="boxshadowhover">
        <Card.Header>
          Document Library
        </Card.Header>
        <Card.Body>
          <div style={{display: 'flex', maxHeight: 100, width: 120, margin: 25}}>
            {loan?.documents?.map((doc) => {
              return (
                <img alt={doc?.attachment} src={doc?.preview} className="img" onClick={() => showImgPreview(doc)} />
              )
            })}
          </div>

          <div className={`${loading ? Classes.SKELETON : ''} upload-area`}>
            <div className="inner-border">
              <input type="file" className="hidden" />
              <h4 className="upload-title">Click to upload....</h4>
            </div>
          </div>
          
        </Card.Body>
      </Card>
      
      
      <Dialog title="ZumConnect" isCloseButtonShown={true} onClose={() => setShowZumConnect(false)} usePortal={true} icon={"shop"} isOpen={showZumConnect} style={{width: 600, height: 700}}>
        <iframe title="zum-connect" src={`${process.env.REACT_APP_ZUM_URL}?testinstitution=${process.env.NODE_ENV === 'development'}${url_params}`} style={{width: '100%', height: '100%'}} />
      </Dialog>

      <Dialog title="Document Preview" isCloseButtonShown={true} onClose={() => setImgModal(false)} usePortal={true} isOpen={imgModal} style={{width: 600, height: 700}}>
        <img alt={selectedImg?.attachment} src={selectedImg?.preview} style={{width: 600, height: 700}}/>
      </Dialog>
    </Container>
  )
}

export default Loan;