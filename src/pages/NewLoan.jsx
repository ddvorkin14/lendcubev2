import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Button, Classes, Divider, FormGroup, InputGroup, Position, Toaster } from "@blueprintjs/core";
import { DateInput } from "@blueprintjs/datetime";
import Checklist from "../components/Checklist";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const NewLoan = () => {
  const [loading, setLoading] = useState(true);
  const [allPossibleUsers, setAllPossibleUsers] = useState([]);
  const navigate = useNavigate();
  const [newLoan, setNewLoan] = useState({
    frequency: 'Monthly', 
    serviceUse: 'Personal',
    country: 'Canada'
  });

  useEffect(() => {
    

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setNewLoan({ ...newLoan, [name]: value })
  }

  const verifyCustomerDetails = () => {
    return !!(newLoan?.firstName && 
      newLoan?.lastName && 
      newLoan?.customerEmail && 
      newLoan?.phoneNumber)
  }

  const verifyCustomerAddress = () => {
    return !!(newLoan?.address1 && 
      newLoan?.city && 
      newLoan?.postalCode && 
      newLoan?.province && 
      newLoan?.country)
  }

  const verifyLoanDetails = () => {
    return !!(
      newLoan?.frequency &&
      newLoan?.serviceUse &&
      newLoan?.amount &&
      newLoan?.startDate
    )
  }

  const allFieldsValid = () => {
    return verifyCustomerDetails && verifyCustomerAddress && verifyLoanDetails
  }

  const resetLoan = () => {
    setNewLoan({
      firstName: '', lastName: '', customerEmail: '', phoneNumber: '',
      address1: '', address2: '', city: '', postalCode: '',
      frequency: 'Monthly', serviceUse: 'Personal', amount: '', startDate: null
    });
    AppToaster.show({ message: 'Loan has been successfully reset back to default', intent: 'success' });
  }

  const fields = [
    { id: 1, label: 'First Name', field: 'firstName', tabIndex: 1, required: true, type: 'text' },
    { id: 2, label: 'Last Name', field: 'lastName', tabIndex: 2, required: true, type: 'text' },
    { id: 3, label: 'Customer Email', field: 'customerEmail', tabIndex: 3, required: true, type: 'text' },
    { id: 4, label: 'Phone #', field: 'phoneNumber', tabIndex: 4, required: true, type: 'text' },
    { id: 5, label: 'divider' },
    { id: 6, label: 'Address 1', field: 'address1', tabIndex: 5, required: true, type: 'text' },
    { id: 7, label: 'Address 2', field: 'address2', tabIndex: 6, required: false, type: 'text' },
    { id: 8, label: 'City', field: 'city', tabIndex: 7, required: true, type: 'text' },
    { id: 9, label: 'Postal Code', field: 'postalCode', tabIndex: 8, required: true, type: 'text' },
    { id: 10, label: 'Province', field: 'province', tabIndex: 9, required: true, type: 'text' },
    { id: 11, label: 'Country', field: 'country', tabIndex: 10, required: true, type: 'text' },
    { id: 12, label: 'divider' },
    { id: 13, label: 'Frequency', field: 'frequency', tabIndex: 11, required: true, type: 'select', options: ["Monthly", "Bi-Weekly"] },
    { id: 14, label: 'Account Type', field: 'serviceUse', tabIndex: 12, required: true, type: 'select', options: ["Personal", "Business"] },
    { id: 15, label: 'Amount ($)', field: 'amount', tabIndex: 13, required: true, type: 'text' },
    { id: 16, label: 'Start Date', field: 'startDate', tabIndex: 14, required: true, type: 'date' },
  ]

  const checklist = [
    { id: 1, label: 'Name, Email and Phone #: Verified', func: verifyCustomerDetails, list: [
      { id: 1, label: 'first name', func: newLoan?.firstName },
      { id: 2, label: 'last name', func: newLoan?.lastName },
      { id: 3, label: 'customer email', func: newLoan?.customerEmail },
      { id: 4, label: 'phone number', func: newLoan?.phoneNumber },
    ] },
    { id: 2, label: 'Customer Address: Verified', func: verifyCustomerAddress, list: [
      { id: 1, label: 'address 1', func: newLoan?.address1 },
      { id: 2, label: 'city', func: newLoan?.city },
      { id: 3, label: 'postal code', func: newLoan?.postalCode },
      { id: 4, label: 'province', func: newLoan?.province },
      { id: 5, label: 'country', func: newLoan?.country },
    ]},
    { id: 3, label: 'Loan Details: Verified', func: verifyLoanDetails, list: [
      { id: 1, label: 'frequency', func: newLoan?.frequency },
      { id: 2, label: 'account type', func: newLoan?.serviceUse },
      { id: 3, label: 'loan amount', func: newLoan?.amount },
      { id: 4, label: 'start date', func: newLoan?.startDate },
    ] }
  ]

  const getMomentFormatter = (format) => {
    return {
        formatDate: (date, locale) => moment(date).locale(locale).format(format),
        parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
        placeholder: format,
    }
};

  return (
    <Container className="pt-4 pb-4 loans-container">
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''}>
          New Loan
        </Card.Header>
        <Card.Body>
          <Row style={{textAlign: 'left'}}>
            <Col lg={8}>
              <Row>
                {fields.map((input) => {
                  return (
                    input.label === 'divider' ? (
                      <Col key={input.id} lg={12} style={{marginBottom: '20px'}}>
                        <Divider />
                      </Col>
                    ) : (
                      <Col lg={6} key={input.id}>
                        {input.type === 'text' ? (
                          <FormGroup
                            className={loading ? Classes.SKELETON : ''}
                            label={input.label}
                            labelFor="text-input"
                            labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                              <InputGroup 
                                id="text-input" 
                                name={input.field}
                                tabIndex={input.tabIndex}
                                value={newLoan[input.field]} 
                                onChange={(e) => onChange(e)} />
                          </FormGroup>  
                        ) : (
                          input.type === 'select' ? (
                            <FormGroup
                              className={loading ? Classes.SKELETON : ''}
                              label={input.label}
                              labelFor="text-input"
                              labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                                <Form.Select size="sm" tabIndex={input.tabIndex} onChange={(e) => onChange(e)} value={newLoan[input.field]}>
                                  {input.options.map((option) => {
                                    return <option key={option}>{option}</option>
                                  })}
                                </Form.Select>
                            </FormGroup>
                          ) : (
                            <FormGroup
                              className={loading ? Classes.SKELETON : ''}
                              label={input.label}
                              labelFor="text-input"
                              labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                                <DateInput 
                                  {...getMomentFormatter("LL")} 
                                  locale="en" 
                                  placeholder={input.label} 
                                  fill={true} 
                                  name={input.field} 
                                  tabIndex={input.tabIndex}
                                  value={newLoan[input.field]}
                                  onChange={(selectedDate) => setNewLoan({...newLoan, [input.field]: selectedDate })}
                                  showActionsBar={true} />
                            </FormGroup>
                            
                          )
                        )}
                      </Col>
                    )
                  )
                })}
              </Row>
            </Col>

            <Col lg={4}>
              <Checklist list={checklist} loading={loading} />
              <FormGroup
                className={loading ? Classes.SKELETON : ''}
                label="Processed By"
                labelFor="text-input"
                labelInfo={<span style={{color: 'red'}}>*</span>}>
                  <Form.Select size="sm" tabIndex={15} onChange={(e) => onChange(e)} value={newLoan?.createdBy}>
                    {allPossibleUsers.map((option) => {
                      return <option key={option}>{option}</option>
                    })}
                  </Form.Select>
              </FormGroup>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer style={{height: 48}} className={loading ? Classes.SKELETON : ''}>
          <div style={{float: 'right'}}>
            <Button icon={"undo"} intent="default" style={{marginRight: 5}} onClick={() => navigate("/loans") }>Cancel</Button>
            <Button icon={"reset"} intent="warning" style={{marginRight: 5}} onClick={() => resetLoan() }>Reset Loan</Button>
            <Button icon={"saved"} intent="success" disabled={!allFieldsValid}>Create Loan</Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default NewLoan;