import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NewLoan from "./NewLoan";
import { BrowserRouter } from "react-router-dom";

describe("<NewLoan />", () => {
  const renderComponent = () =>
    render(
      <BrowserRouter><NewLoan /></BrowserRouter>
    );

  it("should render the form", () =>{
    renderComponent();
    
    expect(screen.getByText("New Loan")).toBeTruthy();
    expect(screen.getByText("First Name")).toBeTruthy();
    expect(screen.getByText("Last Name")).toBeTruthy();
    expect(screen.getByText("Customer Email")).toBeTruthy();
    expect(screen.getByText("Phone #")).toBeTruthy();

    expect(screen.getByText("Create Loan")).toBeTruthy();
    
    expect(screen.getByText("New Loan Checklist")).toBeTruthy();
  });

  it("should render the form and load form fields", () => {
    renderComponent();
    
    const firstName = screen.getByLabelText("First Name *");
    fireEvent.change(firstName, { target: { value: 'John'}});
    expect(firstName.value).toBe("John");

    const lastName = screen.getByLabelText("Last Name *");
    fireEvent.change(lastName, { target: { value: 'Doe' }});
    expect(lastName.value).toBe("Doe");

    const customerEmail = screen.getByLabelText("Customer Email *")
    fireEvent.change(customerEmail, { target: { value: 'johndoe@email.com' }});
    expect(customerEmail.value).toBe("johndoe@email.com");
  })
})