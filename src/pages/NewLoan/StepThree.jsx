import { Button } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const StepThree = (props) => {
  const { onSubmit, previousPage, loan, setLoan } = props;
  const [showIframe, setShowIframe] = useState(loan.zum_customer_id?.length === 0);

  const url_params = `&firstName=${loan?.first_name}&lastName=${loan?.last_name}&email=${loan?.customer_email}&hideShippingAddress=true&displayTermsAndCondition=true&getstatements=true`
  
  useEffect(() => {
    window.addEventListener('message', function(e) {
      var data = e.data;

      if(data.step === 'CONNECTIONSUCCESSFULLYCOMPLETED'){
        setLoan({...loan, zum_customer_id: data.data.userid })
        setShowIframe(false)
      }

      if(data.step === 'CONNECTORCLOSED')
        setShowIframe(false)
    });
  }, []);

  return (
    <Container id="step-three">
      <h1 style={{ textAlign: 'left' }}>Step 3:</h1>
      <form onSubmit={onSubmit}>
        {showIframe ? (
          <iframe title="zum-connect" src={`${process.env.REACT_APP_ZUM_URL}${process.env.NODE_ENV === 'development' ? '&testinstitution=true' : ''}${url_params}`} style={{width: '100%', height: 700}} />
        ) : (
          <>
            <h1>You may proceed to the next step</h1>
            <p><strong>ZUM Customer ID: </strong>{loan.zum_customer_id}</p>
          </>
        )}
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