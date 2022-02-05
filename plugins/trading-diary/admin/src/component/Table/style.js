import { styled } from "@mui/system";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

export const StyledTableRow = styled(TableRow)(
  ({ theme, backgroundcolor, closed }) => ({
    position: "relative",
    backgroundColor: theme.palette.common[backgroundcolor],
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },

    ["&:after"]: {
      position: "absolute",
      left: 0,
      top: "50%",
      height: "1px",
      background: "#c00",
      content: '""',
      width: "98%",
      display: closed ? "block" : "none",
      marginLeft: "1%",
      marginRight: "1%",
    },
  })
);

export const StyledSubTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));
export const OrderTableCell = styled(TableCell)(({ theme, isedit }) => ({
  padding: "10px 5px",
  textAlign: "center",
  verticalAlign: isedit ? "top" : "inherit",
}));
