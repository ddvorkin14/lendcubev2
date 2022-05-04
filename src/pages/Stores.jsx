import { Button, Classes, Dialog, Position, Toaster, FormGroup, InputGroup, MenuItem } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const BREADCRUMBS = [
  { href: "/stores", icon: "folder-close", text: "Stores" }
];

const authHeader = {
  headers: {
    'Authorization': `Bearer ${localStorage.token}`
  }
}

const Stores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [storeData, setStoreData] = useState({});
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/stores", authHeader).then((resp) => {
      setStores(resp.data.stores);
      setLoading(false);
    }).catch((e) => {
      AppToaster.show({ message: 'Error: ' + e, intent: 'danger'});
    });

    axios.get(process.env.REACT_APP_API_URL + "/users", authHeader).then((resp) => {
      setAllUsers(resp.data.users);
    });
  }, []);

  useEffect(() => {
    console.log("Store Data Users: ", storeData?.users);
  }, [storeData?.users])

  const updateStoreUsers = () => {
    axios.post(process.env.REACT_APP_API_URL + "stores/" + storeData?.id + "/manage_users", { users: storeData?.users }, authHeader).then((resp) => {
      setDialogOpen(false);
      if(resp.data.code === 'USERS_ADDED_SUCCESSFULLY'){
        setStoreData({...storeData, users: resp.data.users });
        AppToaster.show({ message: 'Users were successfully added to the store.', intent: 'success' });
      } else {
        AppToaster.show({ message: 'Something went wrong', intent: 'danger' });
      }
    })
  }

  const layoutActions = [
    { id: 1, intent: 'success', label: 'Create New Store', func: () => navigate("/stores/new")}
  ]

  const getStore = (id) => {
    axios.get(process.env.REACT_APP_API_URL + "stores/" + id, authHeader).then((resp) => {
      setStoreData(resp.data);
      setDialogOpen(true);
    })
  }

  const columns = [
    { name: '', width: '60px', selector: row => <Button minimal={true} icon="eye-open" onClick={() => getStore(row.id) } />, sortable: false },
    { name: 'ID', width: '100px', selector: row => `${row.id}`, sortable: true },
    { name: 'Store Name', selector: row => row.name, sortable: true },
    { name: 'Location', selector: row => row.location, sortable: false },
  ]

  const formGroups = [
    { id: 1, label: 'Store Name', field: 'name', required: true, tabIndex: 1, col: 4 },
    { id: 2, label: 'Location', field: 'location', required: true, tabIndex: 2, col: 8 }
  ]

  const multiSelectItemRenderer = (u) => {
    return (
      <MenuItem
        key={u.id}
        text={u.email}
        shouldDismissPopover={true}
        onClick={() => {
          if(!storeData?.users.map(u => u.email).includes(u.email)){
            setStoreData({...storeData, users: [...storeData.users, u]});
          }
        }}
      />
    )
  }

  return(
    <Layout showBreadcrumbs={true} breadcrumbs={BREADCRUMBS} headerTitle="Store List" actions={layoutActions} loading={loading}>
      <Card.Body>
        <div className={loading ? Classes.SKELETON : ''}>
          <DataTable
            columns={columns}
            data={stores}
            selectableRows
            pagination
          />
          <Dialog isOpen={dialogOpen} title="Store Details" isCloseButtonShown={true} onClose={() => setDialogOpen(false)} usePortal={true} icon={"shop"} style={{width: 900}}>
            <Row style={{padding: 10}}>
              {formGroups?.map((input) => {
                return (
                  <Col lg={input.col} key={input.id}>
                    <FormGroup
                      label={input.label}
                      labelFor="text-input"
                      labelInfo={input.required ? <span style={{color: 'red'}}>*</span> : ''}>
                        <InputGroup
                          id="text-input" 
                          name={input.field}
                          tabIndex={input.tabIndex}
                          value={storeData[input.field]} 
                          onChange={(e) => setStoreData({...storeData, [input.field]: e.target.value })} />
                    </FormGroup>
                  </Col>
                )
              })}
            </Row>
            <Row style={{padding: 10}}>
              <Col>
                <h5>Users that belong to this store:</h5>
                <MultiSelect 
                  popoverProps={{ minimal: true }} 
                  noResults={<MenuItem disabled={true} text="No results." />}
                  items={allUsers?.map(u => u)} 
                  itemRenderer={(u) => multiSelectItemRenderer(u)} 
                  tagRenderer={(u) => u.email}
                  onItemSelect={(tag) => {
                    console.log("Tag Selected: ", tag);
                  }}
                  tagInputProps={{
                    onRemove: (tag) => {
                      setStoreData({...storeData, users: storeData.users.filter(u => u.email !== tag) });
                    }
                  }}
                  selectedItems={storeData.users} />
                  <Button onClick={() => updateStoreUsers()} style={{marginLeft: 10}}>Update Store</Button>
              </Col>
            </Row>
          </Dialog>
        </div>
      </Card.Body>
    </Layout>
  )
}

export default Stores;