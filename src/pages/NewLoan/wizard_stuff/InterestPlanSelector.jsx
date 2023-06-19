import { Button } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InterestPlan from "../../../components/InterestPlan";

const InterestPlanSelector = (props) => {
  const { onSubmit, previousPage, loan, setLoan, loanPreview } = props;
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    setSelectedPlan(loan.selected_rate);
  }, [loan]);

  const getSelectedPlan = (plan) => {
    if(selectedPlan){
      return selectedPlan === parseFloat(plan[0].split(" | ")[0]) ? 'selectedPlan' : null
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
                {Object.keys(loanPreview.applicable_plans_plans).map((planId) => {
                  let plan = loanPreview.applicable_plans_plans[planId];
                  let planDetails = loanPreview.applicable_plans.filter((plan) => plan[1] == planId)[0];

                  return (
                    <Col lg="12" xs="12" className="mb-2">
                      <InterestPlan 
                        plan={plan} 
                        details={planDetails} 
                        selectedPlan={selectedPlan} 
                        setSelectedPlan={setSelectedPlan} 
                        getSelectedPlan={getSelectedPlan} 
                        setLoan={setLoan} 
                        loan={loan} 
                      />
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