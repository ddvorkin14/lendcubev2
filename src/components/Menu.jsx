import { Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Classes, Alignment } from "@blueprintjs/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const routeChange = (route) => {
    navigate(`/${route}`)
  }
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading style={{cursor: 'pointer'}} onClick={() => routeChange("loans")}>Lendcube Admin</NavbarHeading>
      </NavbarGroup>
      
      <NavbarGroup align={Alignment.RIGHT}>  
        <Button className={Classes.MINIMAL} icon="home" text="Loans" onClick={() => routeChange("loans")} />
        <Button className={Classes.MINIMAL} icon="inherited-group" text="Customers" onClick={() => routeChange("customers")} />

        <NavbarDivider />

        <Button className={Classes.MINIMAL} icon="user" text="" />
        <Button className={Classes.MINIMAL} icon="notifications" text="" />
        <Button className={Classes.MINIMAL} icon="cog" text="" />
      </NavbarGroup>
    </Navbar>
  )
}

export default Menu;