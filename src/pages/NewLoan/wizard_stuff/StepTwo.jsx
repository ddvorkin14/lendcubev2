import React, { useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";
import { Container, Row } from "react-bootstrap";
import TextSelectDate from "../../../components/TextSelectDate";

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
      <h1 style={{ textAlign: 'left' }}>Loan Details:</h1>
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
          <Button type="button" className="previous" onClick={previousPage}>
            Go Back
          </Button>
          <Button onClick={onSubmit} className="next" intent={"primary"}>
            Continue
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepTwo;