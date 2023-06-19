import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

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

  return (
    <Card id={details[1]} className={`${getSelectedPlan(details)}`} style={{ minHeight: 110, }}>
      <Card.Body>
        <Row>
          <Col style={{ textAlign: "left" }}>
            <h3>{interestTime(details[0])}</h3>
            <h4>{interestAmount(details[0])}</h4>
            <p style={{marginBottom: 0}}><strong>Payment Amount:</strong> ${(plan[0]['total_payment']).toFixed(2)}</p>
            <p style={{marginBottom: 0}}><strong>Total Balance: </strong>${(plan[0]['total_payment'] + plan[0]['remaining_balance']).toFixed(2)}</p>
            <p style={{marginBottom: 0}}><strong>Total Interest: </strong>${(plan.reduce((a, b) => a + b.principal_amount, 0)).toFixed(2)}</p>
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