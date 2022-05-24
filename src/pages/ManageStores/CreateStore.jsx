import React, { useEffect, useState } from "react";
import { Classes, FormGroup, InputGroup, Button, Toaster, Position } from "@blueprintjs/core";
import Layout from "../../components/Layout";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const INITIAL = {
  name: "",
  location: ""
}

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const CreateStore = (props) => {
  const { edit } = props;
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState({});
  const navigate = useNavigate();

  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, []);

  const createStore = () => {
    axios.post(process.env.REACT_APP_API_URL + "stores", { store: store }, authHeader).then((resp) => {
      if(resp.data.success){
        AppToaster.show({ intent: 'success', message: 'New store created successfully'});
        navigate("/stores");
      } else {
        AppToaster.show({ intent: 'danger', message: 'Something went wrong: ' + resp.data?.errors})
      }
    }).catch((e) => {
      console.log("ERROR: ", e);
    })
  }

  const resetStore = () => {
    setStore(INITIAL);
  }

  const footer = () => {
    return(
      <div style={{float: 'right'}}>
        <Button icon={"undo"} intent="default" style={{marginRight: 5}} onClick={() => navigate("/stores") }>Cancel</Button>
        <Button icon={"reset"} intent="warning" style={{marginRight: 5}} onClick={() => resetStore() }>Reset Store</Button>
        <Button icon={"saved"} intent="success" onClick={() => createStore()}>Create Store</Button>
      </div>
    )
  }

  return(
    <Layout showBreadcrumbs={false} headerTitle={`${edit ? 'Edit' : 'Create'} Store`} showFooter={true} footer={footer()}>
      <Row style={{textAlign: 'left'}}>
        <Col lg={4}>
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
                value={store?.name} 
                onChange={(e) => setStore({ ...store, name: e.target.value })} />
          </FormGroup>
        </Col>
      </Row>

      <Row style={{textAlign: 'left'}}>
        <Col lg={5}>
          <FormGroup
            className={loading ? Classes.SKELETON : ''}
            label="Location"
            labelFor="text-input"
            labelInfo={<span style={{color: 'red'}}>*</span>}>
              <InputGroup 
                id="text-input" 
                name="location"
                data-testid="location"
                tabIndex="1"
                value={store?.location} 
                onChange={(e) => setStore({ ...store, location: e.target.value })} />
          </FormGroup>
        </Col>
      </Row>
    </Layout>
  )
}

export default CreateStore;