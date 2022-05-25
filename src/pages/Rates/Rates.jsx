import { Button, Dialog, Divider, Position, Toaster } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, FormSelect, Row } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import Layout from "../../components/Layout";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const BREADCRUMBS = [
  { href: "/rates", icon: "folder-close", text: "Rates" }
];

const NEWROW = { id: '', time_length: '0.5 Years', interest_amount: '0'}

const Rates = () => {
  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }}
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState({});
  const [newCount, setNewCount] = useState(0);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [reloadQuery, setReloadQuery] = useState(true);
  
  useEffect(() => {
    if(localStorage?.token?.length > 10 && reloadQuery){
      axios.get(process.env.REACT_APP_API_URL + "rules", authHeader).then((resp) => {
        setRates(resp.data.rules);
        setLoading(false);
        setReloadQuery(false);
      })
    } else {
      console.log("Error, not token provided");
    }
  }, [reloadQuery]);

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
    { name: 'Actions', width: '100px', selector: row => <Button intent="danger" onClick={() => deleteVariant(row)}>X</Button>}
  ]

  const deleteVariant = (row) => {
    let variants = selectedRate?.variants.filter((variant) => variant.id !== row.id);
    setSelectedRate({ ...selectedRate, variants: variants });
  }

  const interestField = (row) => {
    return <input type="number" className="form-control" value={row.interest_amount} onChange={(e) => updateNewRowDetails(e, row)} name="interest_amount" />
  }

  const updateNewRowDetails = (e, row) => {
    let variant = selectedRate?.variants.filter((variant) => variant.id === row.id)[0];
    variant[e.target.name] = e.target.value;
    setSelectedRate({...selectedRate});
  }

  const timeLengths = (row) => {
    const timeLengths = ["0.5 Years", "1 Year", "1.5 Years", "2 Years", "2.5 Years", "3 Years"];
    return(
      <FormSelect style={{width: '100%'}} value={row.time_length} name="time_length" onChange={(e) => updateNewRowDetails(e, row)}>
        {timeLengths.map((tl) => {
          return <option value={tl}>{tl}</option>
        })}
        
      </FormSelect>
    )
  }

  const addRow = () => {
    selectedRate.variants.push({...NEWROW, id: `new_${newCount}`});
    setNewCount(newCount + 1);
    setSelectedRate({...selectedRate});
  }

  const updateSelectedRate = () => {
    setNewCount(0);
    axios.patch(process.env.REACT_APP_API_URL + "rules/" + selectedRate?.id, { rate: selectedRate }, authHeader).then((resp) => {
      if(resp.data.success){
        AppToaster.show({ intent: 'success', message: 'Interest Rate has been updated successfully' })
        setRates(resp.data.rules);
      } else {
        AppToaster.show({ intent: 'danger', message: 'Selected Rate could not be updated. Please contact support' })
      }
    })
  }

  const undoChanges = () => {
    setNewCount(0);
    axios.get(process.env.REACT_APP_API_URL + "rules", authHeader).then((resp) => {
      setRates(resp.data.rules);
      let rate = rates.filter((rate) => rate.id === selectedRate?.id )[0];
      setSelectedRate(rate);
      setLoading(false);
    })
  }

  const layoutActions = [
    { id: 1, intent: 'success', label: 'Create New Interest Rate', func: () => navigate("/rates/new")},
    { id: 2, intent: 'danger', label: 'Destroy Rules', func: () => handleDestroy()},
  ]

  const formatMoney = (amount) => {
    return(
      <CurrencyFormat value={amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />
    )
  }

  const handleSelect = (state) => setSelectedRows(state.selectedRows?.map((row) => row?.id));
  
  const handleDestroy = () => {
    if(selectedRows?.length > 0){
      axios.post(process.env.REACT_APP_API_URL + "rules/destroy_rules", { ids: selectedRows }, authHeader).then((resp) => {
        if(resp.data?.success){
          AppToaster.show({ intent: 'success', message: 'Rates were destroyed successfully' });
          setReloadQuery(true);
        } else {
          AppToaster.show({ intent: 'danger', message: `Error: ${resp.data?.errors}` })
        }
      })
    } else {
      AppToaster.show({ intent: 'danger', message: 'You must select atleast 1 row before clicking "Destroy Rules"' })
    }
  }

  return (
    <Layout showBreadcrumbs={true} breadcrumbs={BREADCRUMBS} headerTitle="Rates" actions={layoutActions}>
      {!loading && (
        <DataTable
          columns={columns}
          data={rates}
          selectableRows
          pagination
          onSelectedRowsChange={handleSelect}
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
                {formatMoney(selectedRate?.minimum)} to {formatMoney(selectedRate?.maximum)}
                
                <br/>
                
                <strong>New Variants: </strong>
                {newCount}
              </p>  
            </Col>
            <Col style={{position: 'relative', top: 65, textAlign: 'right'}}>
              <Button intent='primary' style={{marginRight: 5}} onClick={() => addRow()}>Add Variant</Button>
              <Button intent="default" style={{marginRight: 5}} onClick={() => undoChanges()}>Undo Changes</Button>
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