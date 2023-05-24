import React, { useEffect, useState } from "react";
import { Button, Classes, Divider, FormGroup, InputGroup } from "@blueprintjs/core";
import { Card, Col, Container, Row } from "react-bootstrap";
import { DateInput } from "@blueprintjs/datetime";

const StepOne = (props) => {
  const { onSubmit, loan, setLoan, determineDate, getMomentFormatter } = props;
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), []);

  const fields = [
    { id: 1, label: 'First Name', field: 'first_name', tabIndex: 1, required: true, type: 'text' },
    { id: 2, label: 'Last Name', field: 'last_name', tabIndex: 2, required: true, type: 'text' },
    { id: 3, label: 'Customer Email', field: 'customer_email', tabIndex: 3, required: true, type: 'text' },
    { id: 4, label: 'Phone #', field: 'customer_phone', tabIndex: 4, required: true, type: 'phone' },
    { id: 5, label: 'Date of Birth', field: 'dob', tabIndex: 5, required: true, type: 'date', minDate: false, disabled: false },
  ]

  const onChange = (e) => {
    const { name, value } = e.target;

    setLoan({...loan, [name]: value })
  }

  // const upload = (file, type) => {
  //   setUploadModal(true);
  //   const url = process.env.REACT_APP_API_URL + "loans/" + id + '/upload_' + type;
    
  //   let formData = new FormData();
  //   formData.append(`loan[${type}]`, file.files[0]);
  //   authHeader.headers['type'] = 'formData'
  //   authHeader.headers['Accept'] = 'application/json'

  //   fetch(url, {
  //     method: "POST",
  //     headers: authHeader.headers,
  //     body: formData
  //   }).then(function (res) {
  //     if(res.status === 200){
  //       axios.get(process.env.REACT_APP_API_URL + 'loans/' + id, authHeader).then((resp) => {
  //         setLoan(resp.data);
  //         setUploadModal(false);
  //         AppToaster.show({ message: `${type} successfully uploaded`, intent: 'success' });
  //       }).catch((e) => {
  //         navigate("/login");
  //       });
  //     }
  //   }, function (e) {
  //     alert("Error submitting form!");
  //   });
  // }

  return (
    <Container id="step-one">
      <h1 style={{ textAlign: 'left' }}>Step 1:</h1>
      <Divider style={{ marginBottom: 10 }} />
      <form onSubmit={onSubmit}>
        <Row>
          {fields.map((input) => {
            return (
              input.type === 'text' ? (
                <Col lg={6} key={input.id}>
                  <FormGroup
                    className={loading ? Classes.SKELETON : ''}
                    label={input.label}
                    labelFor="text-input"
                    labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                      <InputGroup 
                        id="text-input" 
                        name={input.field}
                        data-testid={input.field}
                        tabIndex={input.tabIndex}
                        value={loan[input.field]} 
                        onChange={(e) => onChange(e)} />
                  </FormGroup>  
                </Col>
              ) : (
                <Col lg={3} key={input.id}>
                  <FormGroup
                    className={loading ? Classes.SKELETON : ''}
                    label={input.label}
                    labelFor="text-input"
                    labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                      {input.type == 'date' ? (
                        <DateInput 
                        {...getMomentFormatter("LL")} 
                        locale="en" 
                        disabled={input.disabled}
                        placeholder={input.label} 
                        fill={true} 
                        name={input.field} 
                        minDate={input.minDate ? determineDate(loan[input.field]) : new Date('jan 1 1900')}
                        tabIndex={input.tabIndex}
                        value={new Date(loan[input.field] || new Date())}
                        onChange={(selectedDate) => setLoan({...loan, [input.field]: selectedDate }) }
                        showActionsBar={true} />
                      ) : (
                        <InputGroup 
                          id="text-input" 
                          name={input.field}
                          data-testid={input.field}
                          type="phone"
                          tabIndex={input.tabIndex}
                          value={loan[input.field]} 
                          onChange={(e) => onChange(e)} />
                      )}
                  </FormGroup>
                </Col>
              )
            )
          })}

          {/* <Card className="boxshadowhover">
            <Card.Header>
              Document Library
            </Card.Header>
            <Card.Body>          
              <div style={{display: 'flex'}}>
                <div className={`${loading ? Classes.SKELETON : ''} upload-area`}>
                  <div className="inner-border">
                    <input type="file" className="hidden" name="license" onChange={(e) => upload(e.target, 'license')} />
                    <h4 className="upload-title">License Upload</h4>
                  </div>
                  <div style={{display: 'flex', maxHeight: 100, width: 120, margin: 25}}>
                    {loan?.license &&(
                      <img alt={loan?.license?.attachment} src={loan?.license?.preview} className="img" onClick={() => showImgPreview(loan?.license)} />
                    )}
                  </div>
                </div>

                <div className={`${loading ? Classes.SKELETON : ''} upload-area`}>
                  <div className="inner-border">
                    <input type="file" className="hidden" name="license" onChange={(e) => upload(e.target, 'void_cheque')} />
                    <h4 className="upload-title">Void Cheque Upload</h4>
                  </div>
                  <div style={{display: 'flex', maxHeight: 100, width: 120, margin: 25}}>
                    {loan?.void_cheque && (
                      <img alt={loan?.void_cheque?.attachment} src={loan?.void_cheque?.preview} className="img" onClick={() => showImgPreview(loan?.void_cheque)} />
                    )}
                  </div>
                </div>
              </div>
              
            </Card.Body>
          </Card> */}
        </Row>
        <div className="pagination-buttons">
          <Button onClick={onSubmit} className="next">
            Continue
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default StepOne;