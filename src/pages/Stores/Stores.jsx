import { Button, Classes, Dialog, Position, Toaster, FormGroup, InputGroup, MenuItem, Divider } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const BREADCRUMBS = [
  { href: "/stores", icon: "folder-close", text: "Stores" }
];

const Stores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [storeData, setStoreData] = useState({});
  
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [reloadQuery, setReloadQuery] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [availableRules, setAvailableRules] = useState([]);

  const authHeader = { headers: { 'Authorization': `Bearer ${localStorage.token}` }};

  useEffect(() => {
    if(localStorage.token?.length > 10 && reloadQuery){
      if(localStorage?.current_user_role !== 'admin'){
        navigate("/")
      }
      axios.get(process.env.REACT_APP_API_URL + "stores", authHeader).then((resp) => {
        setStores(resp.data.stores);
        setLoading(false);
        setReloadQuery(false);
      }).catch((e) => {
        AppToaster.show({ message: 'Error: ' + e, intent: 'danger'});
      });
  
      axios.get(process.env.REACT_APP_API_URL + "users", authHeader).then((resp) => {
        setAllUsers(resp.data.users);
      });

      axios.get(process.env.REACT_APP_API_URL + "rules?rule_type=Special Rule", authHeader).then((resp) => {
        setAvailableRules(resp.data.rules);
      })
    }
  }, [reloadQuery]);

  const updateStoreUsers = () => {
    axios.post(process.env.REACT_APP_API_URL + "stores/" + storeData?.id + "/manage_users", { users: storeData?.users }, authHeader).then((resp) => {
      setDialogOpen(false);
      if(resp.data.code === 'USERS_ADDED_SUCCESSFULLY'){
        setReloadQuery(true);
        AppToaster.show({ message: 'Users were successfully added to the store.', intent: 'success' });
      } else {
        AppToaster.show({ message: 'Something went wrong', intent: 'danger' });
      }
    })
  }

  const updateStorePlans = () => {
    axios.post(process.env.REACT_APP_API_URL + "stores/" + storeData?.id + "/manage_plans", { rules: storeData?.rules }, authHeader).then((resp) => {
      setDialogOpen(false);
      if(resp.data.code === 'INTEREST_RULE_ADDED_SUCCESSFULLY'){
        setReloadQuery(true);
        AppToaster.show({ message: 'Interest Rules were successfully added to the store.', intent: 'success' });
      } else {
        AppToaster.show({ message: 'Something went wrong', intent: 'danger' });
      }
    })
  }

  const handleSelect = (state) => setSelectedRows(state.selectedRows?.map((row) => row?.id));

  const destroyStore = () => {
    if(selectedRows?.length > 0){
      axios.post(process.env.REACT_APP_API_URL + "stores/destroy_stores", { store_ids: selectedRows }, authHeader).then((resp) => {
        if(resp.data?.success){
          setStores(resp.data.stores);
          AppToaster.show({ intent: 'success', message: 'Stores were destroyed successfully '})
        } else {
          AppToaster.show({ intent: 'danger', message: 'Error: ' + resp.data?.errors })
        }
      })
    } else {
      AppToaster.show({ intent: 'danger', message: 'You must select atleast 1 row before clicking "Destroy Store"' })
    }
  }

  const layoutActions = [
    { id: 1, intent: 'success', label: 'Create New Store', func: () => navigate("/stores/new") },
    { id: 2, intent: 'danger', label: 'Delete Store', func: () => destroyStore() }
  ]

  const updateStore = () => {
    axios.patch(process.env.REACT_APP_API_URL + "stores/" + storeData?.id, { store: storeData }, authHeader).then((resp) => {
      if(resp.data.success){
        setDialogOpen(false);
        setLoading(true);
        setReloadQuery(true);
        AppToaster.show({ message: 'Store update successful', intent: 'success'})
      } else {
        AppToaster.show({ message: 'Store update was not completed. Please contant IT', intent: 'danger'})
      }
    })
  }

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
    { name: 'Users', selector: row => row.users?.length > 0 ? row.users?.map((user) => user?.email).join(", ") : '', sortable: false }
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

  const interestRuleMultiSelect = (rule) => {
    return (
      <MenuItem
        key={rule.id}
        text={rule.name}
        shouldDismissPopover={true}
        onClick={() => {
          if(!storeData?.rules.map(r => r.name).includes(rule.name)){
            setStoreData({...storeData, rules: [...storeData.rules, rule]});
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
            onSelectedRowsChange={handleSelect}
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
                  <Button onClick={() => updateStoreUsers()} style={{marginLeft: 10}}>Update Store Users</Button>
              </Col>
            </Row>
            
            <Divider/>

            <Row style={{padding: 10}}>
              <Col>
                <h5>Interest Rules that belong to this store:</h5>
                <MultiSelect 
                  popoverProps={{ minimal: true }} 
                  noResults={<MenuItem disabled={true} text="No results." />}
                  items={availableRules?.map(u => u)} 
                  itemRenderer={(u) => interestRuleMultiSelect(u)} 
                  tagRenderer={(u) => u.name}
                  onItemSelect={(tag) => {
                    console.log("Tag Selected: ", tag);
                  }}
                  tagInputProps={{
                    onRemove: (tag) => {
                      setStoreData({...storeData, rules: storeData.rules.filter(r => r.name !== tag) });
                    }
                  }}
                  selectedItems={storeData.rules} />
                  <Button onClick={() => updateStorePlans()} style={{marginLeft: 10}}>Update Store Interest Rules</Button>
              </Col>
            </Row>

            <Divider/>

            <Row style={{margin: '10px 0px 0px 0px', textAlign: 'right'}}>
              <Col>
                <Button intent="default" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button intent="success" onClick={() => updateStore()}>Update Store</Button>
              </Col>
            </Row>
          </Dialog>

        </div>
      </Card.Body>
    </Layout>
  )
}

export default Stores;