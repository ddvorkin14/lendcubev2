import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const StepThree = (props) => {
  const { onSubmit, previousPage, loan, setLoan } = props;
  const [showIframe, setShowIframe] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    window.addEventListener('message', function(e) {
      var data = e.data;

      if(data.step === 'CONNECTIONSUCCESSFULLYCOMPLETED'){
        setLoan({...loan, zum_customer_id: data.data.userid })
      }

      if(data.step === 'CONNECTORCLOSED')
        setShowIframe(false)
    });
  }, []);

  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  useEffect(() => {
    if(!showIframe){
      axios.patch(process.env.REACT_APP_API_URL + "loans/" + loan.id, { new_loan: loan }, authHeader).then((resp) => {
        setLoan(resp.data.loan);
        navigate("/loans/" + resp.data.loan.id);
      })
    }
  }, [showIframe]);

  return (
    <Container id="step-three">
      <form onSubmit={onSubmit}>
        {showIframe && (
          <>
            <iframe title="zum-connect" src={`${process.env.REACT_APP_ZUM_URL}${process.env.NODE_ENV === 'development' ? '&testinstitution=true' : ''}`} style={{width: '100%', height: 700}} />
        
            <div className="pagination-buttons">
              <Button type="button" className="previous" onClick={previousPage}>
                Go Back
              </Button>
            </div>
          </>
        )}
      </form>
    </Container>
  )
}

export default StepThree;