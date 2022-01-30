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
  ({ theme, backgroundcolor }) => ({
    backgroundColor: theme.palette.common[backgroundcolor],
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  })
);

export const StyledSubTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));
