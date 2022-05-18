import * as React from "react";
import { act, render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import Loan from "./Loan";
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

const renderComponent = () => {
  render(<BrowserRouter><Loan /></BrowserRouter>);
}

describe("<Loan />", () => {
  it("should render the datatable with single record", () => {
    renderComponent();

    expect(screen.getByText("#0000undefined")).toBeTruthy();
  });

});