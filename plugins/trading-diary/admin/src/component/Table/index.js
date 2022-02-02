import React, { memo, useEffect } from "react";
import moment from "moment";
import _ from "lodash";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";''
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { averagePrice } from "../../utils/format";

import { Text } from "../index";

import { StyledTableCell, StyledTableRow, StyledSubTableCell } from "./style";

const Row = memo((props) => {
  const { row, isOdd } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        onClick={() => setOpen(!open)}
        backgroundcolor={isOdd ? "gray" : "white"}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Text bold={open ? 1 : 0}>{row.product}</Text>
        </TableCell>
        <TableCell align="center">
          <Text bold={open ? 1 : 0}>{row.type}</Text>
        </TableCell>
        <TableCell align="center">
          <Text bold={open ? 1 : 0}>{row.totalSize}</Text>
        </TableCell>
        <TableCell align="center">
          <Text bold={open ? 1 : 0}>
            {averagePrice(row.orders, row.totalSize, row.digits)}
          </Text>
        </TableCell>
        <TableCell align="center">
          <Text bold={open ? 1 : 0}>2222</Text>
        </TableCell>
        <TableCell align="center">
          <Text bold={open ? 1 : 0}>3333</Text>
        </TableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table aria-label="openOrders">
                <TableHead>
                  <TableRow>
                    <StyledSubTableCell>
                      <Text bold="true">Ticket</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Open Time</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Size</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Price</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Stop Loss</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Take Profit</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Swap</Text>
                    </StyledSubTableCell>
                    <StyledSubTableCell align="center">
                      <Text bold="true">Profit</Text>
                    </StyledSubTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orders.map((order) => (
                    <StyledTableRow key={order.ticket}>
                      <TableCell component="th" scope="row">
                        <Text>{order.ticket}</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>
                          {moment(order.openTime).format("YYYY.MM.DD HH:mm")}
                        </Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>{order.size}</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>{order.openPrice}</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>{order.stopLoss}</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>{order.takeProfit}</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>3333</Text>
                      </TableCell>
                      <TableCell align="center">
                        <Text>4444</Text>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

export const OrdersTable = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>
              <Text bold="true">Product</Text>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text bold="true">Type</Text>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text bold="true">Total Size</Text>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text bold="true">Average Price</Text>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text bold="true">Current Price</Text>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Text bold="true">Total profit</Text>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!_.isEmpty(orders) &&
            orders.map((order, index) => (
              <Row key={order.product} row={order} isOdd={index % 2 == 0} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
