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
// import axios from "axios"

const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 2
});

const WizardLoan = (props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [loan, setLoan] = useState({ start_date: new Date(), frequency: 'Monthly', service_use: 'Personal' });

  useEffect(() => {
    if(localStorage?.token?.length < 10){
      navigate("/login");
      AppToaster.show({ message: 'You must be logged in to proceed', intent: 'danger' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevPage = () => setPage(page - 1)
  const nextPage = () => {
    if(validate())
      setPage(page + 1)
  }

  const validate = () => {
    if(page === 1) {
      return validatePageOne();
    } else if(page === 2) {
      return validatePageTwo();
    } else if(page === 3) {
      return loan.zum_customer_id.length > 0;
    } else if(page === 4){
      return true;
    } else {
      return false;
    }
  }

  const validatePageOne = () => {
    if(loan.first_name?.length > 0 && loan.last_name?.length > 0 && loan.customer_email?.length > 0)
      return true
    else
      AppToaster.show({ message: "All required fields must be filled out before continuing", intent: 'danger'});
  }

  const validatePageTwo = () => {
    if(loan.frequency?.length > 0 && loan.service_use?.length > 0 && loan.amount?.length > 0 && moment(loan.start_date).isValid())
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
      {page === 3 && <StepThree 
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
        setLoan={setLoan} 
        determineDate={(date) => determineDate(date)}
        getMomentFormatter={(format) => getMomentFormatter(format)}
      />}
    </>
  )
}

export default WizardLoan;