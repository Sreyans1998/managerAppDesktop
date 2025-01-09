import React, { useMemo } from "react";
import { TextField } from "@mui/material";
import style from "./style.module.css";

const DynamicForm = ({
  inputs,
  primaryButtonName,
  secondaryButtonName,
  handlePrimaryButton,
  handleSecondaryButton,
}) => {
  // Memoize the input fields for performance optimization
  const renderedInputs = useMemo(() => {
    return inputs.map((input, index) => (
      <TextField
        key={index}
        label={input.label}
        type={input.type}
        value={input.value}
        onChange={(event) => input.onChange(index, event.target.value)}
        fullWidth
        inputProps={{ style: { height: "80%" } }}
        variant="standard"
        InputProps={{
          sx: {
            color: "white", // Default text color
            "&.Mui-focused": {
              color: "white", // Text color on focus
              borderColor: "white", // Optional: border color change on focus
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // Default border color
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // Border color on focus
            },
          },
        }}
        InputLabelProps={{
          sx: {
            "&.Mui-focused": {
              color: "white", // Label color on focus
            },
          },
        }}
      />
    ));
  }, [inputs]);

  return (
    <div className={style.formContent}>
      {renderedInputs}
      <div className={style.formAction}>
        <button className="btn btn-success" onClick={(e) => handlePrimaryButton(e, inputs)}>
          {primaryButtonName}
        </button>
        <button className="btn btn-secondary" onClick={(e) => handleSecondaryButton(e)}>
          {secondaryButtonName}
        </button>
      </div>
    </div>
  );
};

export default DynamicForm;
