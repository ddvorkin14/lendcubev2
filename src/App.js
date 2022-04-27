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

function App() {
  return (
    <Router>
      <div className="App">
        <Menu/>
        
        <Routes>
          <Route path="/loans/:id" element={<Loan />} />
          <Route path="/loans" element={<Loans/>} />
          <Route path="/" element={<Loans />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
