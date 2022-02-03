import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    common: {
      red: "#ef5350",
      gray: "rgba(0, 0, 0, 0.04)",
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
