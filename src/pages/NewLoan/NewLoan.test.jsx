import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewLoan from "./NewLoan";
import { BrowserRouter } from "react-router-dom";

import { server } from '../../../mocks/server.js'

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

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

  it("test a new loan", async () => {
    renderComponent();

    let firstName = screen.getByTestId("first_name");
    userEvent.type(firstName, "John");
    expect(firstName.value).toBe("John");
    
    const lastName = screen.getByTestId("last_name");
    userEvent.type(lastName, 'Doe');
    expect(lastName.value).toBe("Doe");

    const customerEmail = screen.getByTestId("customer_email")
    userEvent.type(customerEmail, 'johndoe@email.com');
    expect(customerEmail.value).toBe("johndoe@email.com");

    const customerPhone = screen.getByTestId("customer_phone");
    userEvent.type(customerPhone, '9050001234');
    expect(customerPhone.value).toBe("9050001234");

    const address1 = screen.getByTestId("address1");
    userEvent.type(address1, '123 street ave' );
    expect(address1.value).toBe("123 street ave");

    const city = screen.getByTestId("city");
    userEvent.type(city, "Toronto" );
    expect(city.value).toBe("Toronto");

    const postalcode = screen.getByTestId("postalcode")
    userEvent.type(postalcode, 'l4j 0h9')
    expect(postalcode.value).toBe("l4j 0h9")

    const province = screen.getByTestId("province");
    userEvent.type(province, 'Ontario' );
    expect(province.value).toBe("Ontario");

    const country = screen.getByTestId("country");
    expect(country.value).toBe("Canada");

    const amount = screen.getByTestId("amount");
    fireEvent.change(amount, {target: {value: ''}})
    userEvent.type(amount, '1000')
    expect(amount.value).toBe("1000");

    const submit = screen.getByText('Create Loan')
    userEvent.click(submit);
    
    expect(await screen.findByText("Loan has been successfully created.")).toBeInTheDocument();
  })
})