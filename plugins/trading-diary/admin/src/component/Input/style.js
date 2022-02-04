import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";

export const StyledAutocomplete = styled(Autocomplete)(({ theme, error }) => ({
  [`& .MuiOutlinedInput-notchedOutline`]: {
    borderColor: error && "red",
  },
}));
