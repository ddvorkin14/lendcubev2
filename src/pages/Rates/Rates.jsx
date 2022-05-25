import { Button, Dialog, Divider } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, FormSelect, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import Layout from "../../components/Layout";

const BREADCRUMBS = [
  { href: "/rates", icon: "folder-close", text: "Rates" }
];

const NEWROW = { id: '', time_length: '', interest_amount: ''}

const Rates = () => {
  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }}
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState({});
  const [newCount, setNewCount] = useState(0);
  
  useEffect(() => {
    if(localStorage?.token?.length > 10){
      axios.get(process.env.REACT_APP_API_URL + "rules", authHeader).then((resp) => {
        setRates(resp.data.rules);
        setLoading(false);
      })
    } else {
      console.log("Error, not token provided");
    }
  }, []);

  const getRate = (id) => {
    setIsOpen(true);
    setSelectedRate(rates.filter(r => r.id === id)[0]);
  }

  const printVariants = (variants) => {
    return variants.map((variant) => `${variant.time_length} - ${variant.interest_amount}%`).join(" | ");
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => getRate(row.id) } />, sortable: false },
    { name: 'ID', width: '70px', selector: row => `${row.id}`, sortable: true },
    { name: 'Name', width: '200px', selector: row => `${row.name}`, sortable: true },
    { name: 'Range', width: '200px', selector: row => `$${row?.minimum} to $${row?.maximum}`, sortable: false },
    { name: 'Interest Rules', selector: row => `${printVariants(row.variants)}` }
  ]

  const variantColumns = [
    { name: 'Time Length', width: '250px', selector: row => timeLengths(row), sortable: false },
    { name: 'Interest Amount (%)', width: '250px', selector: row => interestField(row), sortable: false },
    { name: 'Actions', width: '100px', selector: row => <Button intent="danger">X</Button>}
  ]

  const interestField = (row) => {
    return <input type="text" className="form-control" value={row.interest_amount} onChange={(e) => updateNewRowDetails(e, row)} name="interest_amount" />
  }

  const updateNewRowDetails = (e, row) => {
    let variant = selectedRate?.variants.filter((variant) => variant.id === row.id)[0];
    variant[e.target.name] = e.target.value;
    setSelectedRate({...selectedRate});
  }

  const timeLengths = (row) => {
    return(
      <FormSelect style={{width: '100%'}} value={row.time_length} name="time_length" onChange={(e) => updateNewRowDetails(e, row)}>
        <option value="0.5 Years">0.5 Years</option>
        <option value="1 Year">1 Year</option>
        <option value="1.5 Years">1.5 Years</option>
        <option value="2 Years">2 Years</option>
        <option value="2.5 Years">2.5 Years</option>
        <option value="3 Years">3 Years</option>
      </FormSelect>
    )
  }

  const addRow = () => {
    selectedRate.variants.push({...NEWROW, id: `new_${newCount}`});
    setNewCount(newCount + 1);
    setSelectedRate({...selectedRate});
  }

  const updateSelectedRate = () => {
    console.log("Selected Rate: ", selectedRate);
  }

  return (
    <Layout showBreadcrumbs={true} breadcrumbs={BREADCRUMBS} headerTitle="Rates">
      {!loading && (
        <DataTable
          columns={columns}
          data={rates}
          selectableRows
          pagination
        />
      )}

      <Dialog isOpen={isOpen} title={`Interest Rates for ${selectedRate?.name} - ($${selectedRate.minimum} - $${selectedRate.maximum})`} isCloseButtonShown={true} onClose={() => setIsOpen(false)} usePortal={true} icon={"shop"} style={{width: 900}}>
        <Container>
          <Row>
            <Col>
              <p style={{marginTop: 10}}>
                <strong>Name: </strong>
                {selectedRate?.name}
                <br/>
                <strong>Interest Rate Range: </strong>
                <CurrencyFormat value={selectedRate?.minimum} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
                  &nbsp;to&nbsp;
                <CurrencyFormat value={selectedRate?.maximum} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
                <br/>
                <p>
                  <strong>New Variants: </strong>{newCount}
                </p>
              </p>  
            </Col>
            <Col style={{position: 'relative', top: 65, textAlign: 'right'}}>
              <Button intent='primary' style={{marginRight: 5}} onClick={() => addRow()}>Add Variant</Button>
              <Button intent='success' style={{marginRight: 5}} onClick={() => updateSelectedRate()}>Update</Button>
            </Col>
          </Row>

          <Divider/>

          <DataTable columns={variantColumns} data={selectedRate?.variants} />

        </Container>
      </Dialog>
    </Layout>
  )
}

export default Rates;