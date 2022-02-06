import React from "react";

import { Box } from "@mui/system";
import FormHelperText from "@mui/material/FormHelperText";
import { default as MuiSelect } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { default as MuiTextField } from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { StyledAutocomplete } from "./style";

import { strategies } from "../../constant";

export const HelperText = ({ children }) => {
  return <FormHelperText error>{children}</FormHelperText>;
};

export const Autocomplete = ({ error, label, ...rest }) => {
  return (
    <FormControl fullWidth>
      <StyledAutocomplete
        {...rest}
        error={error}
        renderInput={(params) => <MuiTextField {...params} label={label} />}
      />
      {error && <HelperText>{error}</HelperText>}
    </FormControl>
  );
};

export const Select = ({
  id,
  label,
  labelId,
  name,
  value,
  error,
  options,
  ...rest
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        id={id}
        label={label}
        name={name}
        error={error}
        value={value}
        {...rest}
      >
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <HelperText>{error}</HelperText>}
    </FormControl>
  );
};

export const TextField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  ...rest
}) => {
  return (
    <FormControl fullWidth>
      <MuiTextField
        multiline
        fullWidth
        autoComplete="off"
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        helperText={error}
        error={error ? true : false}
        {...rest}
      />
    </FormControl>
  );
};

export const StrategyCheckbox = ({ onChange, data, disabled }) => {
  return (
    <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
      {strategies.map((strategy) => (
        <FormControlLabel
          key={strategy.name}
          sx={{ margin: 0 }}
          control={
            <Checkbox
              name={strategy.name}
              onChange={onChange}
              checked={data[strategy.name]}
              disabled={disabled}
            />
          }
          label={strategy.label}
        />
      ))}
    </FormGroup>
  );
};
