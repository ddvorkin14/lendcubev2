import { Button } from "@blueprintjs/core";
import React from "react";
import { Container } from "react-bootstrap";

const StepThree = (props) => {
  const { onSubmit, previousPage } = props;
  return (
    <Container id="step-three">
      <h1 style={{ textAlign: 'left' }}>Step 3:</h1>
      <form onSubmit={onSubmit}>
  
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

export default StepThree;