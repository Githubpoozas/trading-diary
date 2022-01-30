import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";

export const StyleTypography = styled(Typography)(
  ({ theme, color, fontSize, bold }) => ({
    fontSize: fontSize ? fontSize : "16px",
    color: color ? theme.palette[color] : theme.palette.color,
    fontWeight: bold ? "bold" : "normal",
  })
);
