import React from 'react';

let checkBoxRef = null;

export default props => (
  <div className="form-check form-check-inline">
    <label className="form-check-label">
      <input className="form-check-input"
        ref={elt => checkBoxRef = elt}
        onChange={() => props.onChange(checkBoxRef ? checkBoxRef.checked : false)}
        type="checkbox"/>
      <span>{props.label}</span>
    </label>
  </div>
);
