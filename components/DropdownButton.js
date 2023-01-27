import React, { useState } from 'react'
import projectname from '../projectname.json'

function DropdownButton({value,setValue}) {
  

  const options = projectname.map((item) => {
    return <option key={item.id} value={item.value}>{item.label}</option>
  })

  function handleChange(event) {
    setValue(event.target.value)
  }

  return (
    <div>
      <select value={value} onChange={handleChange}>
        {options}
      </select>
    </div>
  )
}

export default DropdownButton
