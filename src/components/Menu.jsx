import { Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Classes, Alignment } from "@blueprintjs/core";
import { LogOut } from "@blueprintjs/icons/lib/esm/generated/16px/paths";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Config from "../config";

const Menu = () => {
  const navigate = useNavigate();
  const routeChange = (route) => {
    navigate(`/${route}`)
  }
  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.token}`
    }
  }

  const logout = () => {
    axios.delete("http://localhost:5001/api/v1/login", authHeader).then((resp) => {
      if(resp.data.success){
        localStorage.token = null;
        navigate("/login");
      }
    })
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
        {localStorage?.token?.length > 5 ? (
          <>
            <Button className={Classes.MINIMAL} icon="user" text="" onClick={() => routeChange("account")}/>
            <Button className={Classes.MINIMAL} icon="log-out" text="" onClick={() => logout()} />
            <Button className={Classes.MINIMAL} icon="cog" text="" />
          </>
        ) : (
          <>
            <Button className={Classes.MINIMAL} icon="log-in" text="" onClick={() => routeChange("login")}/>
          </>
        )}
        
      </NavbarGroup>
    </Navbar>
  )
}

export default Menu;