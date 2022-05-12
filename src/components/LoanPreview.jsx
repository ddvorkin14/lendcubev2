import { Card, Classes, Divider, Elevation } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import moment from "moment";

const LoanPreview = (props) => {
  const { loading, id, setNewPlan } = props;
  const [loanPreview, setLoanPreview] = useState({});
  const [reloadPreview, setReloadPreview] = useState(true)

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  useEffect(() => {
    if(id > 0 && reloadPreview){
      console.log("Running reload query")
      const route = "loans/" + id + "/preview";
      axios.get(process.env.REACT_APP_API_URL + route, authHeader).then((resp) => {
        setLoanPreview(resp.data);
        setReloadPreview(false);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPreview]);

  const formatMoney = (amount) => {
    return <CurrencyFormat 
            value={amount} displayType={'text'} 
            decimalScale={2} fixedDecimalScale={true} 
            thousandSeparator={true} prefix={'$'} />
  }

  const onClick = (planId) => {
    setNewPlan(planId);
    setTimeout(() => setReloadPreview(true), 150);
  }

  return (
    <>
      <Row className={loading ? Classes.SKELETON : ''}>
        {loanPreview?.applicable_plans?.map((plan) => {
          return (
            <Col key={plan[1]}>
              <Card interactive={true} onClick={() => onClick(plan[1])} elevation={loanPreview?.selected_plan?.id === plan[1] ? Elevation.FOUR : Elevation.ONE}>
                <strong>{plan[0]}</strong>
              </Card>
            </Col>
          )
        })}
      </Row>
      
      <Divider style={{margin: '20px 10px'}} />
      
      <Row>
        {loanPreview && loanPreview['payment_plan']?.length > 0 && (
          <>
            <table className="bp4-html-table bp4-html-table-condensed bp4-html-table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Principal $</th>
                  <th>Interest $</th>
                  <th>Total Payment</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {loanPreview['payment_plan'].map((balance) => {
                  return (
                    <tr key={moment(balance['date']).format("L")}>
                      <td>{moment(balance['date']).format("LLL")}</td>
                      <td>{formatMoney(balance['principal_amount'])}</td>
                      <td>{formatMoney(balance['total_payment'] - balance['principal_amount'])}</td>
                      <td>{formatMoney(balance['total_payment'])}</td>
                      <td>{formatMoney(balance['remaining_balance'] > 0 ? balance['remaining_balance'] : 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </Row>
    </>
  )
}

export default LoanPreview;