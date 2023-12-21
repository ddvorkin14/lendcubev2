import React, { useEffect, useState } from "react";
import { Classes, Button, Divider, Dialog, Toaster, Position } from "@blueprintjs/core";
import { Card, Col, Container, Row, Spinner, Tabs, Tab, Alert } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import moment from "moment";
import DetailField from "../../components/DetailField";
import LoanPreview from "../../components/LoanPreview";
import MissingPayments from "./MissingPayments";


const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 1
});

const Loan = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  const location = useLocation();
  const event = (new URLSearchParams(location.search)).get("event");

  const [loan, setLoan] = useState({});
  const navigate = useNavigate();
  const [showZumConnect, setShowZumConnect] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  
  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  const bankDetailsPresent = () => {
    if(loan){
      const { branch_transit_number, deposit_account_number, financial_institution_branch_address, financial_institution_name, financial_institution_number } = loan;
      if(branch_transit_number && deposit_account_number && financial_institution_branch_address && financial_institution_name && financial_institution_number){
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    let loanCopy = {};
    if(localStorage?.token?.length > 5){
      let params = event === 'signing_complete' ? '?event=signing_complete' : '';

      axios.get(process.env.REACT_APP_API_URL + 'loans/' + id + params, authHeader).then((resp) => {
        setLoan(resp.data);
        loanCopy = resp.data;
        setLoading(false);
      }).catch((e) => {
        navigate("/login");
      });

      return () => (params = false)
    } else {
      navigate("/login");
    }

    if(event === 'signing_complete'){
      AppToaster.show({ message: 'Loan Signing completed successfully', intent: 'success' })
    }

    window.addEventListener('message', function(e) {
      console.log("event listener triggered")
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
    return () => (loanCopy = false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewPlan = (planId) => {
    axios.post(process.env.REACT_APP_API_URL + "loans/" + id + "/set_new_plan", {rule_id: planId}, authHeader).then((resp) => {
      setLoan(resp.data);
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

  const upload = (file, type) => {
    setUploadModal(true);
    const url = process.env.REACT_APP_API_URL + "loans/" + id + '/upload_' + type;
    
    let formData = new FormData();
    formData.append(`loan[${type}]`, file.files[0]);
    authHeader.headers['type'] = 'formData'
    authHeader.headers['Accept'] = 'application/json'

    fetch(url, {
      method: "POST",
      headers: authHeader.headers,
      body: formData
    }).then(function (res) {
      if(res.status === 200){
        axios.get(process.env.REACT_APP_API_URL + 'loans/' + id, authHeader).then((resp) => {
          setLoan(resp.data);
          setUploadModal(false);
          AppToaster.show({ message: `${type} successfully uploaded`, intent: 'success' });
        }).catch((e) => {
          navigate("/login");
        });
      }
    }, function (e) {
      alert("Error submitting form!");
    });
  }

  const deleteLoan = () => {
    axios.delete(process.env.REACT_APP_API_URL + "loans/" + id, authHeader).then((resp) => {
      if(resp.data.success){
        AppToaster.show({ message: 'Loan was successfully destroyed', intent: 'success' });
        navigate("/loans");
      } else {
        AppToaster.show({ message: 'Loan was not destroyed', intent: 'danger' });
      }
    });
  }

  const syncZum = () => {
    axios.get(process.env.REACT_APP_API_URL + "loans/" + loan?.id + "/sync_zum_customer", authHeader).then((resp) => {
      if(!!resp?.data?.loan){
        setLoan(resp.data?.loan)
        AppToaster.show({ message: 'Zum Customer sync successful', intent: 'success' })
      } else {
        AppToaster.show({ message: `Error: ${resp?.data?.msg}`, intent: 'danger' });
      }
    })
  }

  const syncZumTransactions = () => {
    axios.get(process.env.REACT_APP_API_URL + "loans/" + loan?.id + "/sync_zum", authHeader).then((resp) => {
      if(!!resp?.data?.loan){
        setLoan(resp.data?.loan)
        AppToaster.show({ message: 'Zum Customer Transactions sync successful', intent: 'success' })
      } else {
        AppToaster.show({ message: `Error: ${resp?.data?.msg}`, intent: 'danger' });
      }
    })
  }

  const cancel = () => {
    axios.patch(process.env.REACT_APP_API_URL + "loans/" + loan?.id + "/update_status", { status: 'Cancelled'}, authHeader).then((resp) => {
      AppToaster.show({ message: 'Loan cancelled successfully', intent: 'success' })
      navigate("/loans");
    })
  }

  return (
    <Container className="pt-4 pb-4 loanInfo">
      <Tabs defaultActiveKey="details" id="main-tabs" className="mb-3">
        <Tab eventKey="details" title="Details">
          <Card className="boxshadowhover">
            <Card.Header align="start" className={`${loading ? Classes.SKELETON : ''}`} style={{height: 48}}>
              <div style={{float: 'left'}}>
                {`#0000${loan?.id}`}
              </div>
              <div style={{float: 'right'}}>
                <Button intent="success" onClick={() => navigate(`/loans/${loan?.id}/bankdetails`) }>Manage Bank Details</Button>
                <Button intent="default" onClick={() => navigate(`/loans/${loan?.id}/edit`) } style={{marginLeft: 5}}>Edit Loan</Button>
                {loan?.zum_customer_id === 'N/A' ? (
                  <Button intent="warning" onClick={() => zumConnect()} style={{marginLeft: 5}}>Zum Connect</Button>
                ) : (
                  <Button intent="primary" onClick={() => syncZumTransactions()} style={{marginLeft: 5}}>Create Transaction</Button>
                )}
                {bankDetailsPresent() && (
                  <Button intent="warning" style={{ marginLeft: 5 }} onClick={() => syncZum()}>ZumCustomer Sync</Button>
                )}
                {loan?.docusign_url?.length > 0 && !loan?.agreement_signed && bankDetailsPresent() && (
                  <a type="button" intent="primary" href={loan?.docusign_url} style={{marginLeft: 5}}>Sign Agreement</a>
                )}
                {loan?.zum_customer_id?.length < 5 && !bankDetailsPresent() && (
                  <Button intent="primary" onClick={() => navigate(`/wizard/${loan?.id}`) } style={{marginLeft: 5}}>Continue Wizard</Button>
                )}
                {loan?.status !== 'Cancelled' && (
                  <Button intent="danger" onClick={cancel} style={{marginLeft: 4}}>Cancel Loan</Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {loan?.docusign_url?.length > 0 && loan?.agreement_signed && (
                <Alert key={"success"} variant={"success"} style={{textAlign: 'left'}}>
                  Agreement signed. <a href={loan?.docusign_url}>Docusign Agreement Download</a>
                </Alert>
              )}
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
              <div style={{display: 'flex'}}>
                <div className={`${loading ? Classes.SKELETON : ''} upload-area`}>
                  <div className="inner-border">
                    <input type="file" className="hidden" name="license" onChange={(e) => upload(e.target, 'license')} />
                    <h4 className="upload-title">License Upload</h4>
                  </div>
                  <div style={{display: 'flex', maxHeight: 100, width: 120, margin: 25}}>
                    {loan?.license &&(
                      <img alt={loan?.license?.attachment} src={loan?.license?.preview} className="img" onClick={() => showImgPreview(loan?.license)} />
                    )}
                  </div>
                </div>

                <div className={`${loading ? Classes.SKELETON : ''} upload-area`}>
                  <div className="inner-border">
                    <input type="file" className="hidden" name="license" onChange={(e) => upload(e.target, 'void_cheque')} />
                    <h4 className="upload-title">Void Cheque Upload</h4>
                  </div>
                  <div style={{display: 'flex', maxHeight: 100, width: 120, margin: 25}}>
                    {loan?.void_cheque && (
                      <img alt={loan?.void_cheque?.attachment} src={loan?.void_cheque?.preview} className="img" onClick={() => showImgPreview(loan?.void_cheque)} />
                    )}
                  </div>
                </div>
              </div>
              
            </Card.Body>
          </Card>
          
          
          <Dialog title="ZumConnect" isCloseButtonShown={true} onClose={() => setShowZumConnect(false)} usePortal={true} icon={"shop"} isOpen={showZumConnect} style={{width: 600, height: 700}}>
            <iframe title="zum-connect" src={`${process.env.REACT_APP_ZUM_URL}${process.env.NODE_ENV === 'development' ? '&testinstitution=true' : ''}${url_params}`} style={{width: '100%', height: '100%'}} />
          </Dialog>

          <Dialog title="Document Preview" isCloseButtonShown={true} onClose={() => setImgModal(false)} usePortal={true} isOpen={imgModal} style={{width: 600, height: 700}}>
            <img alt={selectedImg?.attachment} src={selectedImg?.preview} style={{width: 600, height: 700}}/>
          </Dialog>

          <Dialog canOutsideClickClose={false} canEscapeKeyClose={false} onClose={() => setUploadModal(false)} usePortal={true} isOpen={uploadModal} style={{width: 300, height: 300}}>
            <div style={{margin: '0 auto', textAlign: 'center', position: 'relative', top: '35%'}}>
              <Spinner animation="border" role="status"></Spinner>
              <h4>Upload in progress....</h4>
            </div>
          </Dialog>
        </Tab>
        {loan?.zum_customer_id?.length > 3 && localStorage.current_user_role === 'admin' && (
          <Tab eventKey="missing_payments" title="Payments" disabled={localStorage.current_user_role !== 'admin'}>
            <MissingPayments id={id} loan={loan} />
          </Tab>
        )}
      </Tabs>
    </Container>
  )
}

export default Loan;