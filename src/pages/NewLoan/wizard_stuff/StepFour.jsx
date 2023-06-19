import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const StepFour = (props) => {
  const { onSubmit, previousPage, loan, loanPreview } = props;
  const [recipientEmbedUrl, setRecipientEmbedUrl] = useState("");
  const [showFrame, setShowFrame] = useState(false);
  const [showCompletedAgreement, setShowCompletedAgreement] = useState(false);
  const [completedDoc, setCompletedDoc] = useState("");
  const [selectedPlan, setSelectedPlan] = useState();

  useEffect(() => {
    console.log("Preview: ", loanPreview);
    console.log("Loan: ", loan);
    let planID = loanPreview?.applicable_plans[loan?.selected_rate][1];

    setSelectedPlan(loanPreview.applicable_plans_plans[planID]);
  }, []);
  
  const SignWell = ({
    async run() {
      const data = {
        test_mode: process.env === 'development',
        template_id: process.env.REACT_APP_SIGNWELL_TEMPLATE_ID,
        embedded_signing: true,
        template_fields: [
          { api_id: 'Loan Date', value: new Date() },
          { api_id: 'Borrower Name', value: `${loan?.first_name} ${loan?.last_name}` },
          { api_id: 'Borrower Initials', value: `${loan?.first_name.slice(0,1)}. ${loan?.last_name.slice(0,1)}.` },
          { api_id: 'Loan Amount', value: loan?.amount },
          { api_id: 'Frequency of Payment', value: loan?.frequency },
          { api_id: 'Interest Rate', value: loan?.selected_rate },
          { api_id: 'Day of payment', value: new Date(selectedPlan[0].date).toDateString() },
          { api_id: 'Payment Amount', value: selectedPlan[0].total_payment.toFixed(2) },
          { api_id: 'First Payment Date', value: new Date(selectedPlan[0].date).toDateString() },
          { api_id: 'Last Payment Date', value: new Date(selectedPlan[selectedPlan.length - 1].date).toDateString() },
        ],
        recipients: [
          {
            id: "1", placeholder_name: "Lendcube",
            name: "Lendcube", email: "hello@lendcube.ca"
          }, {
            id: loan?.customer_email, placeholder_name: "Client",
            name: `${loan?.first_name} ${loan?.last_name}`, email: loan?.customer_email
          }
        ]
      }

      let config = {
        method: 'POST',
        mode: 'no-cors',
        url: 'https://www.signwell.com/api/v1/document_templates/documents',
        headers: { 
          'Content-Type': 'application/json',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Api-Key': process.env.REACT_APP_SIGNWELL_KEY
        },
        data: data
      };

      return await axios.request(config);
    },
  })

  useEffect(() => {
    if(selectedPlan){
      SignWell.run().then((resp) => {
        if(Object.keys(resp.data).length > 0){
          const recipient = resp.data.recipients.filter((recipient) => {
            if(recipient.id === loan?.customer_email)
              return recipient;
          })[0];
          
          setRecipientEmbedUrl(recipient.embedded_signing_url);
          setShowFrame(true);
        }
      })
    }
  }, []);

  useEffect(() => {
    if (window.SignWellEmbed && recipientEmbedUrl) {
      try {
        const embed = new window.SignWellEmbed({
          url: recipientEmbedUrl,
          events: {
            completed: (e) => {
              console.log("COMPLETED");
            },
            closed: (e) => {
              console.log("CLOSED");
              const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  'X-Api-Key': process.env.REACT_APP_SIGNWELL_KEY
                }
              }
              
              axios.get("https://www.signwell.com/api/v1/documents/" + e.id + "/completed_pdf/?url_only=true", options).then((resp) => {
                setCompletedDoc(resp.data.file_url);
                setShowCompletedAgreement(true);
              })
            }
          }
        });

        embed.open();
      } catch (error) {
        console.error("Error creating SignWellEmbed:", error);
      }
    }
  }, [recipientEmbedUrl])

  useEffect(() => {

  }, [completedDoc]);
  
  return (
    <Container id="step-three">
      <h1 style={{ textAlign: 'left' }}>Agreement Signing:</h1>
      <form onSubmit={onSubmit}>
        {showFrame && <div id="iframe"></div>}
        {showCompletedAgreement && <a href={completedDoc} target="_blank" rel="noreferrer">Download Signed Agreement</a>}

        <div className="pagination-buttons">
          <Button type="button" className="previous" onClick={previousPage}>
            Go Back
          </Button>
          <Button onClick={onSubmit} className="next" intent={"primary"}>
            Proceed
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepFour;