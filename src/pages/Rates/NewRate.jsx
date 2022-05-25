import { Button, Classes, Dialog, FormGroup, InputGroup, Position, Toaster } from "@blueprintjs/core";
import { navigate } from "@reach/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const INITIAL_STATE = {
  name: '', start_range: 0, end_range: 0, rule_type: 'interest'
}

const variantColumns = [
  { name: 'Time Length', width: '250px', selector: row => row?.time_length, sortable: false },
  { name: 'Interest Amount (%)', width: '250px', selector: row => row?.interest_amount, sortable: false }
]

const RULETYPES = [
  { value: 'Interest Rule', label: 'Interest' },
  { value: 'Special Rule', label: 'Special Interest'},
]

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const NewRate = () => {
  const [loading, setLoading] = useState(true);
  const [rule, setRule] = useState(INITIAL_STATE)
  const [existingRules, setExistingRules] = useState([]);
  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }}
  const [showPreview, setShowPreview] = useState(false);
  const [previewRule, setPreviewRule] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + 'rules', authHeader).then((resp) => {
      if(resp.data?.rules?.length > 0){
        setExistingRules(resp.data.rules);
      }
    })
    setLoading(false);

  }, [])

  const formatMoney = (amount) => {
    return(
      <CurrencyFormat value={amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
    )
  }

  const showInterestMsg = () => "This rule will be applied to all applicable loans";
  const showSpecialMsg = () => "This rule will only be available to the Stores that assign the Interest Rule."

  const submitActions = () => {
    return(
      <div style={{textAlign: 'right'}}>
        <Button style={{marginRight: 5}} intent="default" onClick={() => navigate("/rates")}>Cancel</Button>
        <Button style={{marginRight: 5}} intent="success" onClick={() => saveRule()}>Save</Button>
      </div>
    )
  }

  const saveRule = () => {
    axios.post(process.env.REACT_APP_API_URL + "rules", { rule: rule }, authHeader).then((resp) => {
      if(resp.data?.success){
        AppToaster.show({ intent: 'success', message: 'New Interest Rate created successfully' });
        navigate("/rates");
      } else {
        AppToaster.show({ intent: 'danger', message: Object.keys(resp.data?.errors).map((k) => `${k}: ${resp.data?.errors[k]}`) });
      }
    })
    console.log("Rule: ", rule);
  }

  const reviewRule = (rule) => {
    setShowPreview(true);
    setPreviewRule(rule);
  }

  return (
    <Container>
      <Layout headerTitle="Create New Interest Rule" showBreadcrumbs={false} showFooter={true} footer={submitActions()}>
        <Row>
          <Col lg={7}>
            <Row style={{textAlign: 'left'}}>
              <Col lg={12}>
                <FormGroup
                  className={loading ? Classes.SKELETON : ''}
                  label="Name"
                  labelFor="text-input"
                  labelInfo={<span style={{color: 'red'}}>*</span>}>
                    <InputGroup
                      id="text-input" 
                      name="name"
                      data-testid="name"
                      tabIndex="1"
                      value={rule?.name} 
                      onChange={(e) => setRule({ ...rule, name: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>

            <Row style={{textAlign: 'left'}}>
              <Col lg={6}>
                <FormGroup
                  className={loading ? Classes.SKELETON : ''}
                  label="Start Range"
                  labelFor="text-input"
                  labelInfo={<span style={{color: 'red'}}>*</span>}>
                    <InputGroup 
                      id="text-input" 
                      name="start_range"
                      data-testid="start_range"
                      type="number"
                      tabIndex="1"
                      value={rule?.start_range} 
                      onChange={(e) => setRule({ ...rule, start_range: e.target.value })} />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup
                  className={loading ? Classes.SKELETON : ''}
                  label="End Range"
                  labelFor="text-input"
                  labelInfo={<span style={{color: 'red'}}>*</span>}>
                    <InputGroup 
                      id="text-input" 
                      name="end_range"
                      type="number"
                      data-testid="end_range"
                      tabIndex="1"
                      value={rule?.end_range} 
                      onChange={(e) => setRule({ ...rule, end_range: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            
            <Row style={{textAlign: 'left'}}>
              <Col lg={12}>
                <FormGroup
                  className={loading ? Classes.SKELETON : ''}
                  label="Interest Rule Type"
                  labelFor="text-input"
                  labelInfo={<span style={{color: 'red'}}>*</span>}>
                    <Form.Select size="sm" name="rule_type" onChange={(e) => setRule({ ...rule, rule_type: e.target.value })} value={rule['rule_type']}>
                      {RULETYPES.map((option) => {
                        return <option value={option.value}>{option.label}</option>
                      })}
                    </Form.Select>
                  {rule?.rule_type &&(
                    <small>{rule?.rule_type === 'interest' ? showInterestMsg() : showSpecialMsg()}</small>
                  )}
                  
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Col lg={5}>
            <h4 style={{ borderBottom: '1px solid silver', textAlign: 'left' }}>Currently Available Interest Rules</h4>
            <div style={{textAlign: 'left', paddingLeft: '10px'}}>
              {existingRules.map((rule) => {
                return(
                  <p style={{marginBottom: '5px'}} key={rule.id}>
                    {rule?.name} - {formatMoney(rule?.minimum)} to {formatMoney(rule?.maximum)}
                    <a style={{paddingLeft: 5}} id={`review-${rule.id}`} href="#top" onClick={() => reviewRule(rule)}>Review</a>
                  </p>
                )
              })}
            </div>
          </Col>
        </Row>
      </Layout>

      <Dialog isOpen={showPreview} title={`Preview for ${previewRule?.name}`} isCloseButtonShown={true} onClose={() => setShowPreview(false)} usePortal={true} icon={"shop"} style={{width: 700}}>
        <Container>
          <h3>Variant Details</h3>
          <DataTable columns={variantColumns} data={previewRule?.variants} />
        </Container>
      </Dialog>
    </Container>
  )
}

export default NewRate;