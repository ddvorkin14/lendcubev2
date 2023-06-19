// 1. basic info like name and birthdate
// 2. loan amount and rate selection
// 3. loan agreement - docusign
// 4. zum connect

import { Position, Toaster } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import React, { useEffect, useState } from "react";
import StepFour from "./StepFour";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import InterestPlanSelector from "./InterestPlanSelector";
import axios from "axios";
// import axios from "axios"

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const WizardLoan = (props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loan, setLoan] = useState({
    start_date: new Date(), dob: new Date(), frequency: 'Monthly', service_use: 'Personal',
    country: 'Canada', created_by_id: localStorage?.token?.split(":")[0], first_name: '', last_name: '',
    address1: '', address2: '', city: '', province: '', customer_email: '', customer_phone: '', postalcode: '', amount: 0
  });
  const [loanPreview, setLoanPreview] = useState({});

  const authHeader = {
    headers: { 'Authorization': `Bearer ${localStorage.token}` }
  }

  const getPreviewData = async (id) => {
    const route = "loans/" + id + "/preview";
    return await axios.get(process.env.REACT_APP_API_URL + route, authHeader).then((resp) => {
      setLoanPreview(resp.data);
    });
  }

  const saveLoan = () => {
    if(allFieldsValid()){
      axios.post(process.env.REACT_APP_API_URL + "loans", { new_loan: loan }, authHeader).then((resp) => {
        if(!!resp.data.errors){
          Object.keys(resp.data.errors).map((key) => {
            return AppToaster.show({ message: `Loan did not save due to: ${key.replace("_", " ") + ": " + resp.data.errors[key] }`, intent: 'danger' });
          })
        } else {
          setLoan(resp.data.loan);
          getPreviewData(resp.data.loan.id);
        }
      })
    } else {
      AppToaster.show({ message: 'Loan cannot be saved due to invalid data. Please refer to the checklist and try again.', intent: 'danger' });
    }  
  }
  
  const verifyCustomerDetails = () => {
    return !!(loan?.first_name && 
      loan?.last_name && 
      loan?.customer_email && 
      loan?.customer_phone)
  }

  const verifyCustomerAddress = () => {
    return !!(loan?.address1 && 
      loan?.city && 
      loan?.postalcode && 
      loan?.province && 
      loan?.country)
  }

  const verifyLoanDetails = () => {
    return !!(
      loan?.frequency &&
      loan?.service_use &&
      loan?.amount
    )
  }

  const allFieldsValid = () => {
    return verifyCustomerDetails() && verifyCustomerAddress() && verifyLoanDetails()
  }

  useEffect(() => {
    if(localStorage?.token?.length < 10){
      navigate("/login");
      AppToaster.show({ message: 'You must be logged in to proceed', intent: 'danger' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLoan = () => {
    if(allFieldsValid()){
      axios.patch(process.env.REACT_APP_API_URL + "loans/" + loan.id, { new_loan: loan }, authHeader).then((resp) => {
        if(!!resp.data.errors){
          Object.keys(resp.data.errors).map((key) => {
            return AppToaster.show({ message: `Loan did not save due to: ${key.replace("_", " ") + ": " + resp.data.errors[key] }`, intent: 'danger' });
          })
        } else {
          setLoan(resp.data.loan);
          getPreviewData(resp.data.loan.id);
        }
      })
    } else {
      AppToaster.show({ message: 'Loan cannot be saved due to invalid field data. Please refer to the checklist and try again.', intent: 'danger' });
    }
  }

  const prevPage = () => setPage(page - 1)
  const nextPage = () => {
    if(validate()){
      if(page + 1 === 3 && loan.id === undefined)
        saveLoan();
      if(page + 1 === 3 && loan.id)
        updateLoan();
      setPage(page + 1);
    }
  }

  const validate = () => {
    if(page === 1) {
      return validatePageOne();
    } else if(page === 2) {
      return validatePageTwo();
    } else if(page === 4) {
      return loan.zum_customer_id.length > 0;
    } else if(page === 3){
      return true;
    } else {
      return false;
    }
  }

  const validatePageOne = () => {
    if(loan.first_name?.length > 0 && loan.last_name?.length > 0 && loan.customer_email?.length > 0){
      if(!validateEmail()){
        AppToaster.show({ message: 'Customer email format must be valid to proceed', intent: 'danger' });
        return false;
      }

      return true;
    } else {
      AppToaster.show({ message: "All required fields must be filled out before continuing", intent: 'danger'});
    }
  }

  const validateEmail = () => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    if (loan?.customer_email.match(validRegex)) {
      return true;
    } else {
      return false;  
    }
  
  }

  const validatePageTwo = () => {
    if(loan.frequency?.length > 0 && loan.service_use?.length > 0 && loan.amount > 0 && moment(loan.start_date).isValid())
      return true;
    else
      AppToaster.show({ message: "All required fields must be filled out before continuing", intent: 'danger'});
  }

  const determineDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date)
    if(inputDate < today){
      return inputDate;
    }

    return today;
  }

  const getMomentFormatter = (format) => {
    return {
        formatDate: (date, locale) => moment(date).locale(locale).format(format),
        parseDate: (str, locale) => moment(str, format).locale(locale).toDate(),
        placeholder: format,
    }
  };

  return (
    <>
      {page === 1 && <StepOne 
        onSubmit={() => nextPage()} 
        loan={loan} 
        setLoan={setLoan} 
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
      />}
      {page === 2 && <StepTwo 
        onSubmit={() => nextPage()} 
        previousPage={() => prevPage()} 
        loan={loan} 
        setLoan={setLoan}
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
      />}
      {page === 3 && <InterestPlanSelector 
        onSubmit={() => nextPage()} 
        previousPage={() => prevPage()} 
        loan={loan} 
        setLoan={setLoan}
        loanPreview={loanPreview}
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
        getPreviewData={(id) => getPreviewData(id)}
      />}
      {page === 5 && <StepThree 
        onSubmit={() => nextPage()} 
        previousPage={() => prevPage()} 
        loan={loan} 
        setLoan={setLoan} 
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
      />}
      {page === 4 && <StepFour 
        onSubmit={() => nextPage()} 
        previousPage={() => prevPage()} 
        loan={loan}
        loanPreview={loanPreview}
        setLoan={setLoan} 
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
      />}
    </>
  )
}

export default WizardLoan;