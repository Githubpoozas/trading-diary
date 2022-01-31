import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    common: {
      red: "#ef5350",
      gray: "rgba(0, 0, 0, 0.04)",
      white: "#FFFFFF",
    },
  },
  typography: {
    fontSize: 20,
    // htmlFontSize: 20,
  },
  components: {},
});

export default theme;
