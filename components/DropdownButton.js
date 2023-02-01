import React, { useState } from "react";
import projectname from "../projectname.json";
import sourcedata from "../sourcedata.json";

function DropdownButton({ value, setValue, setSheetDetails }) {
  const options = projectname.map((item) => {
    return (
      <option key={item.id} value={item.value}>
        {item.label}
      </option>
    );
  });

  function handleChange(event) {
    setValue(event.target.value);
    setSheetDetails(
      Object.entries(sourcedata[0]).find(
        (item) => item[0] === event.target.value
      )[1]
    );
  }

  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option> Select Project</option>
        {options}
      </select>
    </div>
  );
}

export default DropdownButton;
