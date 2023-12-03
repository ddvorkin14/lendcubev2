import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Moment from 'moment';
import { Classes, Button, MenuItem, Toaster, Position, Icon } from "@blueprintjs/core";
import { Tooltip2, Classes as Classes2 } from "@blueprintjs/popover2";
import { Link, useNavigate } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import Layout from "../../components/Layout";
import { Select2 } from "@blueprintjs/select";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const BREADCRUMBS = [
  { href: "/loans", icon: "folder-close", text: "Loans" }
];


const Loans = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState({});

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  const filterStores = (query, store, _index, exactMatch) => {
    const normalizedName = store.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
 
    if (exactMatch) {
        return normalizedName === normalizedQuery;
    } else {
        return `${normalizedName}`.indexOf(normalizedQuery) >= 0;
    }
};

  useEffect(() => {
    setLoading(true)
    if(localStorage?.token?.length > 10){
      if(selectedFilter === 'all'){
        getLoans();
      } else if(selectedFilter === 'not-connected'){
        getNotConnectedLoans();
      } else {
        getMissingLoans();
      }
    } else {
      navigate("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedFilter]);

  const getNotConnectedLoans = () => {
    axios.get(process.env.REACT_APP_API_URL + 'loans/not_connected', authHeader).then((resp) => {
      setData(resp.data.loans.sort((a, b) => b.id - a.id));
      setLoading(false);
      setDataLoading(false);
    }).catch(function (error) {
      if(error.code === "ERR_BAD_REQUEST"){
        localStorage.token = null;
        navigate("/login");
      }
    });
  }

  const getLoans = () => {
    axios.get(process.env.REACT_APP_API_URL + 'loans?search=' + query, authHeader).then((resp) => {
      setData(resp.data.loans);
      setStores(resp.data.stores);
      setLoading(false);
      setDataLoading(false);
    }).catch(function (error) {
      if(error.code === "ERR_BAD_REQUEST"){
        localStorage.token = null;
        navigate("/login");
      }
    });
  }

  const getMissingLoans = () => {
    axios.get(process.env.REACT_APP_API_URL + 'loans/missed_payment_loans', authHeader).then((resp) => {
      setData(resp.data.loans.sort((a, b) => b.id - a.id));
      setLoading(false);
      setDataLoading(false);
    }).catch(function (error) {
      if(error.code === "ERR_BAD_REQUEST"){
        console.log("Error: ", error);
      }
    });
  }

  const sendMailer = (loanID) => {
    axios.get(process.env.REACT_APP_API_URL + 'notifications/missing_payment?loan_id=' + loanID, authHeader).then((resp) => {
      AppToaster.show({ message: resp.data.message, intent: 'success' });
    }).catch(function (error) {
      if(error.code === "ERR_BAD_REQUEST"){
        console.log("Error: ", error);
      }
    });
  }

  const columns = [
    { name: '', width: '60px', selector: row => {
      return(
        <Tooltip2 
          placement="top" 
          content={<div style={{ marginBottom: 5}}>Missing Payment Email!</div>}
          className={Classes2.TOOLTIP2_INDICATOR}
          usePortal={false}
          intent="success">
            <Button minimal={true} icon="envelope" onClick={() => sendMailer(row.id) } />
        </Tooltip2>
      )
    }, sortable: false }, 
    { name: 'ZUM', width: '75px', selector: row => {
      return row.zum_customer_id !== 'N/A' ? <Icon icon="confirm" intent="success" /> : <Icon icon="error" intent="danger"/>
    }, sortable: false },
    { name: 'ID', width: '90px', selector: row => <Link to={"/loans/" + row.id}>000-{row.id}</Link>, sortable: false },
    { name: 'First Name', selector: row => row.first_name, sortable: true },
    { name: 'Last Name', selector: row => row.last_name, sortable: true },
    { name: 'Email', width: '240px', selector: row => row.customer_email, sortable: true },
    { name: 'Amount', width: '100px', selector: row => <CurrencyFormat value={row.amount} displayType={'text'} decimalScale={2} fixedDecimalScale={true} thousandSeparator={true} prefix={'$'} />, value: row => row.amount, sortable: true },
    { name: 'Frequency', width: '110px', selector: row => row.frequency, sortable: true },
    { name: 'Created', width: '170px', selector: row => `${Moment(row.created_at).format("L LT")}`, sortable: true },
  ];

  const layoutActions = [
    { id: 1, intent: 'success', label: 'Create New Loan', func: () => navigate("/loans/new") },
    { id: 2, intent: 'primary', label: 'Begin Loan Wizard', func: () => navigate("/wizard") },
  ]

  const renderStore = (store, { handleClick, handleFocus, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={store.id}
            onClick={handleClick}
            onFocus={handleFocus}
            text={store.name}
        />
    );
  };

  useEffect(() => {
    if(selectedStore.id > 0){
      setDataLoading(true);
      axios.get(process.env.REACT_APP_API_URL + 'loans/filter_by_store?selected_store_id=' + selectedStore.id, authHeader).then((resp) => {
        setData(resp.data.loans.sort((a, b) => b.id - a.id));
        setLoading(false);
        setDataLoading(false);
      }).catch(function (error) {
        if(error.code === "ERR_BAD_REQUEST"){
          console.log("Error: ", error);
        }
      });
    }
  }, [selectedStore])

  return(
    <Layout 
      showBreadcrumbs={true} 
      breadcrumbs={BREADCRUMBS}
      actions={layoutActions}>
        <Row>
          <Col lg={4}>
            <div style={{ margin: '0px 22px' }}>
              <input style={{width: '100%'}} type="search" data-testid="searchbar" value={query} placeholder="Search for a Loan...." onChange={(e) => {
                setSelectedStore({});
                setQuery(e.target.value);
                setDataLoading(true);
              }} />
            </div>
          </Col>
        </Row>

        <Card.Body>
          <div style={{textAlign: 'left'}}>
            <Row>
              <Col lg={6} style={{display: 'flex'}}>
                <Button intent={selectedFilter === 'all' ? 'primary' : 'default'} onClick={() => setSelectedFilter("all")} style={{marginRight: 2 }}>All</Button>  
                <Button intent={selectedFilter === 'missing' ? 'primary' : 'default'} onClick={() => setSelectedFilter("missing")} style={{marginRight: 2 }}>Missing Payments</Button>
                <Button intent={selectedFilter === 'not-connected' ? 'primary' : 'default'} onClick={() => setSelectedFilter("not-connected")} style={{marginRight: 2 }}>Not Connected</Button>
                <Select2
                  items={stores}
                  itemPredicate={filterStores}
                  itemRenderer={renderStore}
                  noResults={<MenuItem disabled={true} text="No results." />}
                  onItemSelect={setSelectedStore}
                  minimal={true}
                >
                  <Button text={selectedStore?.name || '-- select a store --'} rightIcon="double-caret-vertical" placeholder="Select a store" />
                </Select2>
              </Col>
            </Row>
          </div>
          {!loading ? (
            <div className={dataLoading ? Classes.SKELETON : ''} style={{marginTop: 10}}>
              <DataTable
                columns={columns}
                data={data}
                selectableRows
                pagination
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Card.Body>
    </Layout>
  )
};

export default Loans;