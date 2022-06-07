import { Button, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Classes, Alignment } from "@blueprintjs/core";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

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
    axios.delete(process.env.REACT_APP_API_URL + "login", authHeader).then((resp) => {
      if(resp.data.success){
        localStorage.current_user_role = null;
        localStorage.token = null;
        navigate("/login");
      }
    })
  }

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading style={{cursor: 'pointer'}} onClick={() => routeChange("loans")}>Lendcube</NavbarHeading>
      </NavbarGroup>
      
      <NavbarGroup align={Alignment.RIGHT}>  
        {localStorage?.token?.length > 5 ? (
          <>
            {localStorage?.current_user_role === 'admin' && (
              <Button className={Classes.MINIMAL} icon="dashboard" text="Dashboard" onClick={() => routeChange("dashboard")} />  
            )}

            <Button className={Classes.MINIMAL} icon="home" text="Loans" onClick={() => routeChange("loans")} />
            {localStorage?.current_user_role === 'admin' && (
              <>
                <Button className={Classes.MINIMAL} icon="inherited-group" text="Users" onClick={() => routeChange("users")} />
                <Button className={Classes.MINIMAL} icon="shop" text="Stores" onClick={() => routeChange("stores")} />
                <Button className={Classes.MINIMAL} icon="percentage" text="Rates" onClick={() => routeChange("rates")} />
              </>
            )}
            <NavbarDivider />
            <>
              <Button className={Classes.MINIMAL} icon="user" text="" onClick={() => routeChange("account")}/>
              <Button className={Classes.MINIMAL} icon="log-out" text="" onClick={() => logout()} />
            </>
          </>
        ) : (
          <>
            <>
              <Button className={Classes.MINIMAL} icon="log-in" text="Login" onClick={() => routeChange('login')} />
              <Button className={Classes.MINIMAL} icon="plus" text="Sign Up" onClick={() => routeChange('signup')} />
            </>
          </>
        )}
        
      </NavbarGroup>
    </Navbar>
  )
}

export default Menu;