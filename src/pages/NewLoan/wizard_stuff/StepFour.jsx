import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const StepFour = (props) => {
  const { onSubmit, previousPage, loan } = props;
  const [recipientEmbedUrl, setRecipientEmbedUrl] = useState("");
  const [showFrame, setShowFrame] = useState(false);
  console.log("Env Vars", process.env)

  const SignWell = ({
    async run() {
      const data = {
        test_mode: true,
        template_id: process.env.REACT_APP_SIGNWELL_TEMPLATE_ID,
        embedded_signing: true,
        template_fields: [
          { api_id: 'Loan Date', value: new Date() },
          { api_id: 'Borrower Name', value: `${loan?.first_name} ${loan?.last_name}` },
          { api_id: 'Borrower Initials', value: `${loan?.first_name.slice(0,1)}. ${loan?.last_name.slice(0,1)}.` },
          { api_id: 'Loan Amount', value: loan?.amount },
          { api_id: 'Frequency of Payment', value: loan?.frequency },
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
  }, []);

  
  return (
    <Container id="step-three">
      <h1 style={{ textAlign: 'left' }}>Step 4:</h1>
      <form onSubmit={onSubmit}>
        {showFrame && (
          <iframe title="sign-well" src={recipientEmbedUrl} target="_parent" frameborder="0" allowfullscreen></iframe>
        )}
        
        <div className="pagination-buttons">
          <Button type="button" className="previous" onClick={previousPage}>
            Go Back
          </Button>
          <Button onClick={onSubmit} className="next">
            Process Loan
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepFour;