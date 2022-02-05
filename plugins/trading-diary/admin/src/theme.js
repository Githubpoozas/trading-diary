import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    common: {
      red: "#ef5350",
      gray: "#F0F0F0",
      darkGray: "#E8E8E8",
      white: "#FFFFFF",
      blue: "#1976d2",
      lightBlue: "#1976d2",
      darkBlue: "#1565c0",
    },
  },
  typography: {
    fontSize: 20,
    // htmlFontSize: 16,
  },
  components: {},
});

export default theme;
