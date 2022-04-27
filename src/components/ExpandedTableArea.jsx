import React from "react";

const ExpandedTableArea = (props) => {
  const { data } = props;
  return (
    <p>Expanded Area: {JSON.stringify(data)}</p>
  )
}

const ExpandedComponent = ({ data }) => {
  return(
   <ExpandedTableArea data={data} />
  )
}




export default ExpandedComponent;