import { Classes, Position, FormGroup, InputGroup, Toaster, Button } from "@blueprintjs/core";
import axios from "axios";
import { Toast } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Checklist from "../components/Checklist";

const BANKFIELDS = [
  { id: 1, label: 'Institution Number', field: 'financial_institution_number', required: true, tabIndex: 1 },
  { id: 2, label: 'Institution Name', field: 'financial_institution_name', required: true, tabIndex: 2 },
  { id: 3, label: 'Account Number', field: 'deposit_account_number', required: true, tabIndex: 3 },
  { id: 4, label: 'Transit Number', field: 'branch_transit_number', required: true, tabIndex: 4 },
  { id: 5, label: 'Institution Address', field: 'financial_institution_branch_address', required: true, tabIndex: 5, col: 12 }
]

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const LoanBankDetails = () => {
  const { id } = useParams();
  const [loanErrors, setLoanErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState({});
  const navigate = useNavigate();

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  const fieldVerifications = [
    { id: 1, label: 'Institution number is valid', func: () => loan?.financial_institution_number?.length > 0 },
    { id: 2, label: 'Transit number is valid', func: () => loan?.branch_transit_number?.length > 0 },
  ]

  useEffect(() => {
    if(localStorage?.token?.length > 5){
      axios.get(process.env.REACT_APP_API_URL + 'loans/' + id, authHeader).then((resp) => {
        setLoan(resp.data);
        setLoading(false);
      }).catch((e) => {
        setLoanErrors(e);
      });
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveBankDetails = () => {
    axios.patch(process.env.REACT_APP_API_URL + 'loans/' + id, { new_loan: loan }, authHeader).then((resp) => {
      AppToaster.show({ message: 'Loan bank details successfully updated', intent: 'success'})
    }).catch((e) => {
      setLoanErrors(e);
    })
  }

  const onChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  }

  const resetLoan = () => {
    setLoan({
      financial_institution_number: '', financial_institution_name: '', 
      deposit_account_number: '', branch_transit_number: '', financial_institution_branch_address: '', 
    });
    AppToaster.show({ message: 'Loan has been successfully reset back to default', intent: 'warning' });
  }

  return(
    <Container className="pt-4 pb-4 loans-container">
       {loanErrors.length > 0 && loanErrors?.map((error) => {
          return <Toast intent='danger' message={error} timeout={15000} position={Position.TOP}/>
        })
      }
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''}>
          {`Financial Details for #0000${loan?.id}`}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={8}>
              <Row>
                {BANKFIELDS.map((input) => {
                  return (
                    <Col key={input.id} lg={input?.col || 6}>
                      <FormGroup
                        className={loading ? Classes.SKELETON : ''}
                        label={input.label}
                        labelFor="text-input"
                        style={{textAlign: 'left'}}
                        labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                          <InputGroup
                            id="text-input" 
                            name={input.field}
                            tabIndex={input.tabIndex}
                            value={loan[input.field] || ''} 
                            onChange={(e) => onChange(e)} />
                      </FormGroup>
                    </Col>
                  )
                })}
              </Row>
            </Col>
            <Col lg={4} style={{textAlign: 'left'}}>
              <Checklist list={fieldVerifications} loading={loading} />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer style={{height: 48}} className={loading ? Classes.SKELETON : ''}>
          <div style={{float: 'right'}}>
            <Button icon={"undo"} intent="default" style={{marginRight: 5}} onClick={() => navigate("/loans") }>Cancel</Button>
            <Button icon={"reset"} intent="warning" style={{marginRight: 5}} onClick={() => resetLoan() }>Reset Bank Info</Button>
            <Button icon={"saved"} intent="success" onClick={() => saveBankDetails()}>Save Bank Details</Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default LoanBankDetails;