import React from 'react'

const Fields = ({ labelName, name, value, onChangeValue }) => {
  
  return(
    <div className="mx-5">
      {labelName ? <div className="form-label">{labelName}</div> : null }
      <input type="text" className="form-control" name={name} value={value} onChange={(e) => onChangeValue(e)}/>
    </div>
  );
};

export default Fields;