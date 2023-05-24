import { Button } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";

const StepFour = (props) => {
  const SignWell = ({
    async run() {
      const headers = {
        "X-Api-Key": "YWNjZXNzOmU1OWZmYzRlNTQ4YjUzOGZhY2MxZTc5YWZhMWMzZWI1",
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }

      const data = {
        "test_mode": true,
        "template_id": "c83ee11d-a373-4851-9132-bc6e8c987b73",
        "embedded_signing": true,
        "template_fields": [
          { "api_id": 'Loan Date', "value": '2023-05-01T00:00:00-05:00' },
          { "api_id": 'Borrower Name', "value": "Daniel Dvorkin"}
        ],
        "recipients": [
          {
            "id": "1",
            "placeholder_name": "Lendcube",
            "name": "Lendcube",
            "email": "hello@lendcube.ca"
          }, {
            "id": "client@email.com",
            "placeholder_name": "Client",
            "name": "First LastName",
            "email": "client@email.com"
          }
        ]
      }

      return await axios.post('https://www.signwell.com/api/v1/document_templates/documents/', data, { headers: headers, mode: 'no-cors' });
    },
  })

  useEffect(() => {
    SignWell.run().then((resp) => {
      console.log("Response: ", resp)
    })
  }, []);

  const { onSubmit, previousPage } = props;
  return (
    <Container id="step-three">
      <h1 style={{ textAlign: 'left' }}>Step 4:</h1>
      <form onSubmit={onSubmit}>
  
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