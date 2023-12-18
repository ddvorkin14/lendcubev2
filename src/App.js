import {
  Routes,
  Route
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Loans from "./pages/Loans/Loans";
import Menu from "./components/Menu";
import Loan from "./pages/Loan/Loan";
import Login from "./pages/Auth/Login";
import NewLoan from "./pages/NewLoan/NewLoan";
import LoanBankDetails from "./pages/Loan/LoanBankDetails";
import Users from "./pages/Users/Users";
import Stores from "./pages/Stores/Stores";
import Account from "./pages/Auth/Account";
import CreateStore from "./pages/ManageStores/CreateStore";
import Rates from "./pages/Rates/Rates";
import NewRate from "./pages/Rates/NewRate";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import WizardLoan from "./pages/NewLoan/wizard_stuff/WizardLoan";
import ChangePassword from "./pages/Auth/ChangePassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NewUser from "./pages/Users/NewUser";

function App() {
  return (
    <div className="App">
      <Menu/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/first_time" exact element={<ForgotPassword first_time={true} />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/new" element={<CreateStore edit={false} />} />
        <Route path="/users" exact element={<Users />} />
        <Route path="/users/new" exact element={<NewUser />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/change_password" exact element={<ChangePassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/loans/:id/edit" element={<NewLoan edit={true} />} />
        <Route path="/loans/:id/bankdetails" element={<LoanBankDetails />} />
        <Route path="/loans/:id" element={<Loan />} />
        <Route path="/loans" element={<Loans/>} />
        <Route path="/loans/new" element={<NewLoan />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/rates/new" element={<NewRate />} />
        <Route path="/wizard" element={<WizardLoan />} />
        <Route path="/wizard/:id" element={<WizardLoan />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/" element={<Loans />} />
      </Routes>
    </div>
  );
}

export default App;
