import React, { useEffect, useState } from "react";
import { Button, Classes, Divider, FormGroup, InputGroup } from "@blueprintjs/core";
import { Card, Col, Container, Row } from "react-bootstrap";
import { DateInput } from "@blueprintjs/datetime";
import TextSelectDate from "../../../components/TextSelectDate";

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
              <TextSelectDate
                key={`${input?.id}`}
                onChange={onChange} 
                input={input} 
                loading={loading} 
                loan={loan} 
                setLoan={setLoan} 
                getMomentFormatter={getMomentFormatter} 
                determineDate={determineDate} />
            )
          })}
        </Row>

        <div className="pagination-buttons">
          <Button onClick={onSubmit} className="next" intent={"primary"}>
            Continue
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepOne;