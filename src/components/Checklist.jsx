import { Classes, Divider, Icon } from "@blueprintjs/core";
import React from "react";
import { Card } from "react-bootstrap";

const Checklist = (props) => {
  return (
    <Card>
      <Card.Header align="start" className={props.loading ? Classes.SKELETON : ''}>
        New Loan Checklist
      </Card.Header>
      <Card.Body>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }} className={props.loading ? Classes.SKELETON : ''}>
          {props.list?.map((item) => {
            return (
              <div key={item.id}>
                <li>
                  <Icon
                    icon={item.func() ? 'tick' : 'cross'} 
                    style={{ color: (item.func() ? 'green' : 'red'), marginRight: 10}} />{item.label}
                  <ul style={{ listStyleType: 'none', paddingLeft: 40 }} data-testid={`${item.id}-checklist`} className={props.loading ? Classes.SKELETON : ''}>
                    {item.list?.map((listItem) => {
                      return (
                        <li key={listItem.id}>
                          <Icon
                            data-testid={`list-${listItem.label?.replace(" ", "_")}`}
                            icon={listItem.func ? 'tick' : 'cross'} 
                            style={{ color: (listItem.func ? 'green' : 'red'), marginRight: 10}} />
                          {listItem.label}
                        </li>
                      )
                    })}
                  </ul>
                </li>
                <li><Divider/></li>
              </div>
            )
          })}
        </ul>
      </Card.Body>
    </Card>
  )
}

export default Checklist;