import { Classes, Breadcrumbs, Button } from "@blueprintjs/core";
import React from "react";
import { Card, Container } from "react-bootstrap";

const Layout = (props) => {
  const { loading, showBreadcrumbs, breadcrumbs, headerTitle, actions, children } = props;

  return(
    <Container className="pt-4 pb-4 loans-container">
      <Card>
        <Card.Header align="start" className={loading ? Classes.SKELETON : ''} style={{height: 48}}>
          <div style={{float: 'left'}}>
            {showBreadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} />
            ) : (
              headerTitle
            )}
          </div>
          <div style={{float: 'right'}}>
            {actions?.map((action) => {
              return <Button key={action.id} intent={action.intent} onClick={action.func}>{action.label}</Button>
            })}
          </div>
        </Card.Header>
        <Card.Body>
          {children}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Layout;