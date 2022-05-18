import * as React from "react";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import Loans from "./Loans";
import { BrowserRouter } from "react-router-dom";

import { server } from '../../../mocks/server.js'
import userEvent from "@testing-library/user-event";

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

describe("<Loans />", () => {
  it("should render the datatable with 3 records then filter down to 1", async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {token: "12345678910"}
    })
    
    render(<BrowserRouter><Loans /></BrowserRouter>);
    expect(await screen.findByText("Dani")).toBeTruthy();

    const searchQuery = screen.getByTestId("searchbar");
    userEvent.type(searchQuery, 'John');
    expect(searchQuery.value).toBe("John");

    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(await screen.findByText("Dani")).not.toBeInTheDocument();

  });

});