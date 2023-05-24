// 1. basic info like name and birthdate
// 2. loan amount and rate selection
// 3. loan agreement - docusign
// 4. zum connect

import React, { useEffect } from "react";
import axios from "axios"

const WizardLoan = () => {
  const SignWell = ({
    async run() {
      const headers = {
        "X-Api-Key": "YWNjZXNzOmU1OWZmYzRlNTQ4YjUzOGZhY2MxZTc5YWZhMWMzZWI1",
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

      return await axios.post('https://www.signwell.com/api/v1/document_templates/documents/', data, { headers: headers });
    },
  })

  useEffect(() => {
    SignWell.run().then((resp) => {
      console.log("Response: ", resp)
    })
  }, []);

  return (
    <h1>Wizard Loan</h1>
  )
}

export default WizardLoan;