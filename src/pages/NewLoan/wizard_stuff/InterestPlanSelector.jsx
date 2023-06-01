import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const InterestPlanSelector = (props) => {
  const { onSubmit, previousPage, loan, setLoan, loanPreview, getPreviewData } = props;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assignment, setAssignment] = useState("");

  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  const setNewPlan = (plan) => {
    setSelectedPlan(null);
    axios.post(process.env.REACT_APP_API_URL + "loans/" + loan.id + "/set_new_plan", { rule_id: plan[1] }, authHeader).then((resp) => {
      setLoan(resp.data);
      // getPreviewData(loan.id);
    });
  }

  useEffect(() => {
    setSelectedPlan(loan.selected_rate);
  }, [loan]);

  const getSelectedPlan = (plan) => {
    if(selectedPlan){
      return selectedPlan === parseFloat(plan[0].split(" | ")[0]) ? 'selectedPlan' : ''
    }
  }

  return (
    <Container id="step-one">
      <h1 style={{ textAlign: 'left' }}>Interest Plan Selection:</h1>
      <form onSubmit={onSubmit}>
        <Row>
          {Object.keys(loanPreview).length > 0 && (
            <>
              <Row>
                {loanPreview.applicable_plans.map((plan) => {
                  return (
                    <Col lg="6" xs="12" className="mb-2">
                      <Card id={plan[1]} className={`boxshadowhover ${getSelectedPlan(plan)}`} style={{ cursor: 'pointer', minHeight: 110, }} onClick={() => setNewPlan(plan)}>
                        <Card.Body>
                          <strong>{plan[0]}</strong>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </>
          )}
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

export default InterestPlanSelector;