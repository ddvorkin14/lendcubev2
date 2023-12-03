import React, { useEffect, useState } from "react";
import { Classes } from "@blueprintjs/core";
import { Badge, Card } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import CurrencyFormat from "react-currency-format";
import axios from "axios";

const MissingPayments = (props) => {
  const { id, loan } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [loanPreview, setLoanPreview] = useState({});

  const columns = [
    { name: 'Date', width: '140px', selector: row => `${parseDate(row.date)}`, sortable: false },
    { name: 'Interest $', width: '110px', selector: row => currencyFormat(row.interest_amount), sortable: false },
    { name: 'Principal $', width: '110px', selector: row => currencyFormat(row.principal_amount), sortable: false },
    { name: 'Remaining', width: '110px', selector: row => currencyFormat(row.remaining_balance), sortable: false },
    { name: 'Total $', width: '150px', selector: row => currencyFormat(row.total_payment), sortable: false },
    { name: 'Transaction ID', width: '350px', selector: row => row.transactionId || '--', sortable: false },
    { name: 'Transaction Date', width: '140px', selector: row => parseDate(row.transactionDate), sortable: false },
    { name: 'Status', width: '140px', selector: row => determineStatus(row), sortable: false }
  ];

  const determineStatus = (row) => {
    console.log(row.transactionStatus);
    if(row.transactionStatus === 'Completed'){
      return <h5 style={{ minWidth: 100 }}><Badge style={{ minWidth: 100 }} bg="success">Completed</Badge></h5>
    }

    if(row.transactionStatus === 'Late' || row.transactionStatus === 'Failed'){
      return <h5 style={{ minWidth: 100 }}><Badge style={{ minWidth: 100 }} bg="danger">{row.transactionStatus}</Badge></h5>
    }
    
    if(row.transactionStatus === 'InProgress' ){
      return <h5 style={{ minWidth: 100 }}><Badge style={{ minWidth: 100 }} bg="warning">In-Progress</Badge></h5>
    }

    if(row.transactionStatus === 'Upcoming'){
      return <h5 style={{ minWidth: 100 }}><Badge style={{ minWidth: 100 }} bg="primary">Up-Coming</Badge></h5>
    }
  }

  const currencyFormat = (amount) => {
    return <CurrencyFormat value={amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
  }
  
  const parseDate = (date) => {
    if(new Date(date).toDateString() === 'Invalid Date'){
      return '--'
    }

    return new Date(date).toDateString();
  }

  const dateDifference = (date1, date2) => {
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);
  }

  var config = {
    method: 'post', url: process.env.REACT_APP_ZUM_API_URL + '/Authorize',
    headers: { 'Content-Type': 'application/json' }, 
    data: JSON.stringify({
      "Username": process.env.REACT_APP_ZUM_USERNAME,
      "Password": process.env.REACT_APP_ZUM_PASSWORD
    })
  };

  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }}

  useEffect(() => {
    axios(config)
    .then(function (response) {
      if(response.data.result){
        setToken(response.data.result.Token);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(token.length > 0 && loan?.zum_customer_id?.length > 0){
      const route = "loans/" + id + "/preview";
      axios.get(process.env.REACT_APP_API_URL + route, authHeader).then((resp) => {
        setLoanPreview(resp.data);
        setLoading(false);
      });

      var transactionConfig = {
        method: 'post',
        url: process.env.REACT_APP_ZUM_API_URL + '/transaction/filter',
        headers: { 
          'Authorization': 'Bearer ' + token, 
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "UserId": loan?.zum_customer_id
        })
      };

      axios(transactionConfig)
      .then(function (response) {
        if(response.data.result){
          setData(response.data.result.Items)
        }
        
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if(data.length > 0 && loanPreview?.payment_plan?.length > 0){
      loanPreview?.payment_plan?.forEach(row => {
        let rowDate = new Date(row.date);

        let tran = data.filter((d) => {
          let tranDate = new Date(d.CreatedAt);
        
          if(loan?.frequency === 'Monthly'){
            return tranDate.getMonth() === rowDate.getMonth()
          } else {
            return dateDifference(rowDate, tranDate) < 14
          }
        });
        
        if(tran.length > 0){
          row.transactionId = tran[0].Id;
          row.transactionDate = tran[0].CreatedAt
          row.transactionStatus = tran[0].TransactionStatus
        } else if(new Date() > rowDate){
          row.transactionStatus = "Late"
        } else {
          row.transactionStatus = "Upcoming"
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return(
    <Card>
      <Card.Header align="start" className={loading ? Classes.SKELETON : ''}>
        {`Manage Payments for #0000${loan?.id} | ${loan?.customer_email}`}
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={loanPreview?.payment_plan}
          pagination
        />
      </Card.Body>
    </Card>
  )
}

export default MissingPayments;