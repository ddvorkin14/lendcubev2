import { Button, Card, Divider, Elevation } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import Layout from "../../components/Layout";

const Dashboard = () => {
  const [loanData, setLoanData] = useState();
  const navigate = useNavigate();
  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` } }

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "dashboard/loans", authHeader).then((resp) => {
      if(resp.data?.loans){
        setLoanData(resp.data.loans);
      }
    })
  }, []);

  const getLoanData = (time) => {
    if(loanData){
      const today = moment();
      const keys = {
        'This Week': 'week', 
        'This Month': 'month', 
        'This Quarter': 'quarter', 
        'This Year': 'year'
      }
      
      if(time === 'Today')
        return loanData.filter((loan) => moment(loan.created_at) === new Date());
      else
        return loanData.filter((loan) => moment(loan.created_at) > today.startOf(keys[time]) && moment(loan.created_at) < today.endOf(keys[time]));
    }
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => navigate("/loans/" + row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `${row.id}`, sortable: false },
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', width: '250px', selector: row => row.customer_email, sortable: true },
    { name: 'Country', width: '100px', selector: row => row.country, sortable: true },
    { name: 'Amount', width: '120px', selector: row => <CurrencyFormat value={row.amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />, sortable: false },
    { name: 'Frequency', width: '110px', selector: row => row.frequency, sortable: true },
    { name: 'Created', width: '170px', selector: row => `${moment(row.created_at).format("L LT")}`, sortable: true }
  ];

  return (
    <Layout headerTitle="Dashboard" container="fluid">
      <Row style={{marginBottom: 20}}>
        <Col>
          <Card interactive={true} elevation={Elevation.TWO} style={{textAlign: 'left'}}>
            <h5 style={{borderBottom: '1px solid silver'}}>Total Loans</h5>
            
            {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'].map((time) => {
              return (
                <>
                  <small>{time}: </small>
                  <strong>{getLoanData(time)?.length}</strong>
                  <div className="bp4-progress-bar bp4-intent-primary .modifier">
                    <div className="bp4-progress-meter" style={{width: ((getLoanData(time)?.length / loanData?.length) * 100).toString() + "%"}}></div>
                  </div>
                  <br/>
                </>
              )
            })}
          </Card>
        </Col>

        <Col>
          <Card interactive={true} elevation={Elevation.TWO} style={{textAlign: 'left'}}>
            <h5 style={{borderBottom: '1px solid silver'}}>Loan Statistics</h5>
          </Card>
        </Col>

        <Col>
          <Card interactive={true} elevation={Elevation.TWO} style={{textAlign: 'left'}}>
            <h5 style={{borderBottom: '1px solid silver'}}>Total Customers</h5>
          </Card>
        </Col>
      </Row>

      <Divider/>

      <Row>
        <Col>
          <h3 style={{textAlign: 'left'}}>All Loans</h3>
          <DataTable
            columns={columns}
            data={loanData}
            selectableRows
            pagination
          />
        </Col>
      </Row>
    </Layout>
  )
}

export default Dashboard;