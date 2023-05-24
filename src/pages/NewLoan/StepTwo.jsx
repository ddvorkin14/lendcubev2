import React, { useEffect, useState } from "react";
import { Button, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Col, Container, Form, Row } from "react-bootstrap";
import { DateInput } from "@blueprintjs/datetime";

const StepTwo = (props) => {
  const { onSubmit, previousPage, loan, setLoan, determineDate, getMomentFormatter } = props;

  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), []);

  const fields = [
    { id: 6, label: 'Frequency', field: 'frequency', tabIndex: 6, required: true, type: 'select', options: ["Monthly", "Bi-Weekly"] },
    { id: 7, label: 'Account Type', field: 'service_use', tabIndex: 7, required: true, type: 'select', options: ["Personal", "Business"] },
    { id: 8, label: 'Amount ($)', field: 'amount', tabIndex: 8, required: true, type: 'text' },
    { id: 9, label: 'Start Date', field: 'start_date', tabIndex: 9, required: true, type: 'date', minDate: true, disabled: true }
  ]

  const onChange = (e) => {
    const { name, value } = e.target;

    setLoan({...loan, [name]: value })
  }

  return (
    <Container id="step-two">
      <h1 style={{ textAlign: 'left' }}>Step 2:</h1>
      <form onSubmit={onSubmit}>
        <Row>
          {fields.map((input) => {
            return (
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
                        data-testid={input.field}
                        tabIndex={input.tabIndex}
                        value={loan[input.field]} 
                        onChange={(e) => onChange(e)} />
                  </FormGroup>  
                ) : (
                  input.type === 'select' ? (
                    <FormGroup
                      className={loading ? Classes.SKELETON : ''}
                      label={input.label}
                      labelFor="text-input"
                      labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                        <Form.Select size="sm" tabIndex={input.tabIndex} name={input.field} onChange={(e) => onChange(e)} value={loan[input.field]}>
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
                          disabled={input.disabled}
                          placeholder={input.label} 
                          fill={true} 
                          name={input.field} 
                          minDate={input.minDate ? determineDate(loan[input.field]) : new Date('jan 1 1900')}
                          tabIndex={input.tabIndex}
                          value={new Date(loan[input.field] || new Date())}
                          onChange={(selectedDate) => setLoan({...loan, [input.field]: selectedDate }) }
                          showActionsBar={true} />
                    </FormGroup>
                    
                  )
                )}
              </Col>
            )
          })}
        </Row>
        <div className="pagination-buttons">
          <Button type="button" className="previous" onClick={previousPage}>
            Go Back
          </Button>
          <Button onClick={onSubmit} className="next">
            Continue
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepTwo;