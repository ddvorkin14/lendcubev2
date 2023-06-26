import { Button } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InterestPlan from "../../../components/InterestPlan";
import RangeSlider from 'react-bootstrap-range-slider';

const SliderWithInputFormControl = (loan, setLoan, updateLoan) => {
  const [newVal, setNewVal] = useState(loan?.amount);

  const getNewPlans = () => {
    updateLoan();

  }

  return (
    <Row>
      <Col xs="8">
        <RangeSlider
          min={500}
          max={10000}
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          onAfterChange={e => setLoan({ ...loan, amount: newVal }) }
        />
      </Col>
      <Col xs="4">
        <input style={{ width: 80, float: 'left', textAlign: 'right' }} value={loan?.amount} onChange={e => setLoan({ ...loan, amount: e.target.value }) } />
        <Button style={{ width: 120 }} onClick={() => getNewPlans()} intent="success">Get New Plans</Button>
      </Col>
    </Row>
  );
};

const InterestPlanSelector = (props) => {
  const { onSubmit, previousPage, loan, setLoan, loanPreview, updateLoan } = props;
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
      {SliderWithInputFormControl(loan, setLoan, updateLoan)}
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
        <div className="pagination-buttons" style={{marginBottom: 100, marginTop: 20}}>
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