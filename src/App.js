import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Loans from "./pages/Loans";
import Menu from "./components/Menu";
import Loan from "./pages/Loan";
import Login from "./pages/Login";
import NewLoan from "./pages/NewLoan";
import LoanBankDetails from "./pages/LoanBankDetails";

function App() {
  console.log(process.env.REACT_APP_API_URL);
  return (
    <Router>
      <div className="App">
        <Menu/>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/loans/:id/bankdetails" element={<LoanBankDetails />} />
          <Route path="/loans/:id" element={<Loan />} />
          <Route path="/loans" element={<Loans/>} />
          <Route path="/loans/new" element={<NewLoan />} />
          <Route path="/" element={<Loans />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
