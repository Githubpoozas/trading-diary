import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { StyledButton } from "./style";

export const Button = ({ onClick, children, loading, disabled, ...rest }) => {
  return (
    <StyledButton disabled={disabled || loading} onClick={onClick} {...rest}>
      {loading ? (
        <CircularProgress
          sx={{ width: "20px !important", height: "20px !important" }}
        />
      ) : (
        children
      )}
    </StyledButton>
  );
};
