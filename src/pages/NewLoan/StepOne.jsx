import React, { useEffect, useState } from "react";
import { Button, Classes, Divider, FormGroup, InputGroup } from "@blueprintjs/core";
import { Col, Container, Row } from "react-bootstrap";
import { DateInput } from "@blueprintjs/datetime";

const StepOne = (props) => {
  const { onSubmit, loan, setLoan, determineDate, getMomentFormatter } = props;
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), []);

  const fields = [
    { id: 1, label: 'First Name', field: 'first_name', tabIndex: 1, required: true, type: 'text' },
    { id: 2, label: 'Last Name', field: 'last_name', tabIndex: 2, required: true, type: 'text' },
    { id: 3, label: 'Customer Email', field: 'customer_email', tabIndex: 3, required: true, type: 'text' },
    { id: 4, label: 'Phone #', field: 'customer_phone', tabIndex: 4, required: true, type: 'phone' },
    { id: 5, label: 'Date of Birth', field: 'dob', tabIndex: 5, required: true, type: 'date', minDate: false, disabled: false },
  ]

  const onChange = (e) => {
    const { name, value } = e.target;

    setLoan({...loan, [name]: value })
  }

  return (
    <Container id="step-one">
      <h1 style={{ textAlign: 'left' }}>Step 1:</h1>
      <Divider style={{ marginBottom: 10 }} />
      <form onSubmit={onSubmit}>
        <Row>
          {fields.map((input) => {
            return (
              input.type === 'text' ? (
                <Col lg={6} key={input.id}>
                  <FormGroup
                    className={loading ? Classes.SKELETON : ''}
                    label={input.label}
                    labelFor="text-input"
                    labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                      <InputGroup 
                        id="text-input" 
                        name={input.field}
                        data-testid={input.field}
                        tabIndex={input.tabIndex}
                        value={loan[input.field]} 
                        onChange={(e) => onChange(e)} />
                  </FormGroup>  
                </Col>
              ) : (
                <Col lg={3} key={input.id}>
                  <FormGroup
                    className={loading ? Classes.SKELETON : ''}
                    label={input.label}
                    labelFor="text-input"
                    labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                      {input.type == 'date' ? (
                        <DateInput 
                        {...getMomentFormatter("LL")} 
                        locale="en" 
                        disabled={input.disabled}
                        placeholder={input.label} 
                        fill={true} 
                        name={input.field} 
                        minDate={input.minDate ? determineDate(loan[input.field]) : new Date('jan 1 1900')}
                        tabIndex={input.tabIndex}
                        value={new Date(loan[input.field] || new Date())}
                        onChange={(selectedDate) => setLoan({...loan, [input.field]: selectedDate }) }
                        showActionsBar={true} />
                      ) : (
                        <InputGroup 
                          id="text-input" 
                          name={input.field}
                          data-testid={input.field}
                          type="phone"
                          tabIndex={input.tabIndex}
                          value={loan[input.field]} 
                          onChange={(e) => onChange(e)} />
                      )}
                  </FormGroup>
                </Col>
              )
            )
          })}
        </Row>
        <div className="pagination-buttons">
          <Button onClick={onSubmit} className="next">
            Continue
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepOne;