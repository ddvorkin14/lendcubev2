import { Classes } from "@blueprintjs/core";
import React from "react";
import { Col, Row } from "react-bootstrap";

const DetailField = (props) => {
  return (
    <Row className={props.loading ? Classes.SKELETON : ''}>
      <Col sm="4" style={{textAlign: 'right'}}>
        <strong>{props.field}: </strong>
      </Col>
      <Col>
        {props.value}
      </Col>
    </Row>
  )
}

export default DetailField;