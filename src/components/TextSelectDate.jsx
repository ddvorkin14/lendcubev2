import React from "react";
import { Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Col, Form } from "react-bootstrap";
import { DateInput } from "@blueprintjs/datetime";

const TextSelectDate = (props) => {
  return (
    <Col lg={6} key={props?.input.id}>
      {props?.input.type === 'text' ? (
        <FormGroup
          className={props?.loading ? Classes.SKELETON : ''}
          label={props?.input.label}
          labelFor="text-input"
          labelInfo={props?.input.required ? <span style={{color: 'red'}}>*</span> : ''}>
            <InputGroup 
              id="text-input" 
              name={props?.input.field}
              data-testid={props?.input.field}
              tabIndex={props?.input.tabIndex}
              value={props?.loan[props?.input.field]} 
              onChange={(e) => props?.onChange(e)} />
        </FormGroup>  
      ) : (
        props?.input.type === 'select' ? (
          <FormGroup
            className={props?.loading ? Classes.SKELETON : ''}
            label={props?.input.label}
            labelFor="text-input"
            labelInfo={props?.input.required ? <span style={{color: 'red'}}>*</span> : ''}>
              <Form.Select size="sm" tabIndex={props?.input.tabIndex} name={props?.input.field} onChange={(e) => props?.onChange(e)} value={props?.loan[props?.input.field]}>
                {props?.input.options.map((option) => {
                  return <option key={option}>{option}</option>
                })}
              </Form.Select>
          </FormGroup>
        ) : (
          <FormGroup
            className={props?.loading ? Classes.SKELETON : ''}
            label={props?.input.label}
            labelFor="text-input"
            labelInfo={props?.input.required ? <span style={{color: 'red'}}>*</span> : ''}>
              <DateInput
                {...props?.getMomentFormatter("LL")} 
                locale="en" 
                disabled={props?.input.disabled}
                placeholder={props?.input.label} 
                fill={true} 
                name={props?.input.field} 
                minDate={props?.input.minDate ? props?.determineDate(props?.loan[props?.input.field]) : new Date('jan 1 1900')}
                tabIndex={props?.input.tabIndex}
                value={new Date(props?.loan[props?.input.field] || new Date())}
                onChange={(selectedDate) => props?.setLoan({...props?.loan, [props?.input.field]: selectedDate }) }
                showActionsBar={true} />
          </FormGroup>
          
        )
      )}
    </Col>
  )
}

export default TextSelectDate;