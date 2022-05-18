import {
  Routes,
  Route
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Loans from "./pages/Loans/Loans";
import Menu from "./components/Menu";
import Loan from "./pages/Loan/Loan";
import Login from "./pages/Login";
import NewLoan from "./pages/NewLoan/NewLoan";
import LoanBankDetails from "./pages/LoanBankDetails";
import Users from "./pages/Users";
import Stores from "./pages/Stores";
import Account from "./pages/Account";

function App() {
  return (
    <div className="App">
      <Menu/>
      <Routes>
        <Route path="/stores" element={<Stores />} />
        <Route path="/users" element={<Users />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loans/:id/edit" element={<NewLoan edit={true} />} />
        <Route path="/loans/:id/bankdetails" element={<LoanBankDetails />} />
        <Route path="/loans/:id" element={<Loan />} />
        <Route path="/loans" element={<Loans/>} />
        <Route path="/loans/new" element={<NewLoan />} />
        <Route path="/" element={<Loans />} />
      </Routes>
    </div>
  );
}

export default App;
