import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useState } from "react";
import { Card, Col, Row, Alert } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";

const InterestPlan = (props) => {
  const { details, plan, setLoan, setSelectedPlan, getSelectedPlan, loan } = props;
  const [loading, setLoading] = useState(false);
  const [loader] = useState("Processing...");

  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  const interestTime = (str) => {
    const timeStr = str.split(" | ")[1];
    if(parseFloat(timeStr) < 1.0){
      return parseFloat(timeStr) * 12 + (parseFloat(timeStr) * 12 > 1 ? " Months" : " Month")
    }

    return parseFloat(timeStr) + (parseFloat(timeStr) > 1 ? " Years" : " Year")
  }

  const interestAmount = (str) => {
    const timeStr = str.split(" | ")[0];
    
    return "@ " + timeStr;
  }

  const setNewPlan = (plan) => {
    setSelectedPlan(null);
    setLoading(true);

    axios.post(process.env.REACT_APP_API_URL + "loans/" + loan.id + "/set_new_plan", { rule_id: plan[1] }, authHeader).then((resp) => {
      setLoan(resp.data);
      setSelectedPlan(plan);
      setLoading(false);
    });
  }

  const getTotalInterestPerPayment = () => {
    const principal_payments = plan.reduce((a, b) => a + b.principal_amount, 0);
    const total_payments = plan.reduce((a, b) => a + b.total_payment, 0);
    return (total_payments - principal_payments).toFixed(2);
  }
  
  return (
    <Card id={details[1]} className={`${getSelectedPlan(details)}`} style={{ minHeight: 110, }}>
      <Card.Body>
        {plan?.filter((p) => p?.interest_amount == 0).length > 0 && (
          <Alert key="zero_interest_plan" variant={"success"} style={{textAlign: 'left', lineHeight: 0, maxHeight: 30}}>
            0% Interest Free Plan
          </Alert>
        )}
        <Row>
          <Col style={{ textAlign: "left" }}>
            <h3>{interestTime(details[0])}</h3>
            <h4>{interestAmount(details[0])}</h4>
            <p style={{marginBottom: 0}}><strong>Total Payments:</strong> {plan.length}</p>
            <p style={{marginBottom: 0}}>
              <strong>Payment Amount:&nbsp;</strong>
              <CurrencyFormat value={plan[0]?.total_payment} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
            </p>
            {/* <p style={{marginBottom: 0}}><strong>Total Interest: </strong>${getTotalInterestPerPayment()}</p> */}
            <p style={{marginBottom: 0}}><strong>Last Payment Due: </strong>{new Date(plan[plan.length - 1].date).toDateString()}</p>
            
            {loading && (
              <div  style={{position: "absolute", bottom: -5, right: 20 }}>
                <p>{loader}</p>
              </div>
            )}
            {!getSelectedPlan(details) ? (
              <div style={{position: "absolute", bottom: 10, right: 10 }}> 
                {!loading && (
                  <Button intent={'success'} onClick={() => setNewPlan(details)}>Select Plan</Button>
                )}
              </div>
            ) : (
              <div style={{position: "absolute", bottom: -5, right: 20 }}>
                <p>Currently Selected</p>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default InterestPlan;