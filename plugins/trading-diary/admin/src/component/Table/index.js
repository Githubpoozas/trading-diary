import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";

import { averagePrice } from "../../utils/format";

import { Text, Button, ConfirmDialog } from "../index";

import { timeFrame } from "../../instance";

import { StyledTableCell, StyledTableRow, StyledSubTableCell } from "./style";

const OrderRow = ({ data, onSaveOrder, onCloseOrder }) => {
  const [inputValue, setInputValue] = useState({
    ticket: "",
    type: "",
    size: 0,
    openTime: null,
    closeTime: null,
    openPrice: 0,
    closePrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    swap: 0,
    profit: 0,
    comment: "",
    isEdit: false,
  });

  useEffect(() => {
    console.log("data", data);
    setInputValue(data);
  }, [data]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setInputValue(data);
  };

  const handleEditOrder = () => {
    setInputValue({ ...inputValue, isEdit: true });
  };

  const onClickSave = () => {
    onSaveOrder(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };
  const onClickClose = () => {
    onCloseOrder(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };

  return (
    <StyledTableRow>
      <TableCell component="th" scope="row" sx={{ padding: "10px 5px" }}>
        {inputValue.isEdit ? (
          <TextField
            id="orderTicket"
            label="Ticket"
            variant="outlined"
            name="ticket"
            type="number"
            value={inputValue.ticket}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.ticket}</Text>
        )}
      </TableCell>

      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <DateTimePicker
            label="Open Time"
            renderInput={(props) => <TextField {...props} />}
            value={inputValue.openTime}
            onChange={(newValue) => {
              setInputValue({
                ...inputValue,
                openTime: newValue,
              });
            }}
          />
        ) : (
          <Text>{moment(inputValue.openTime).format("YYYY.MM.DD HH:mm")}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderSize"
            label="Size"
            variant="outlined"
            name="size"
            type="number"
            value={inputValue.size}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.size}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderOpenPrice"
            label="OpenPrice"
            variant="outlined"
            name="openPrice"
            type="number"
            value={inputValue.openPrice}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.openPrice}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderStopLoss"
            label="Stop Loss"
            variant="outlined"
            name="stopLoss"
            type="number"
            value={inputValue.stopLoss}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.stopLoss}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderTakeProfit"
            label="Take Profit"
            variant="outlined"
            name="takeProfit"
            type="number"
            value={inputValue.takeProfit}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.takeProfit}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Close Time"
            value={inputValue.closeTime}
            onChange={(newValue) => {
              setInputValue({
                ...inputValue,
                closeTime: newValue,
              });
            }}
          />
        ) : (
          <Text>{moment(inputValue.closeTime).format("YYYY.MM.DD HH:mm")}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderClosePrice"
            label="Close Price"
            variant="outlined"
            name="closePrice"
            type="number"
            value={inputValue.closePrice}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.closePrice}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderSwap"
            label="Swap"
            variant="outlined"
            name="swap"
            type="number"
            value={inputValue.swap}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.swap}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderProfit"
            label="Profit"
            variant="outlined"
            name="profit"
            type="number"
            value={inputValue.profit}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.profit}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        {inputValue.isEdit ? (
          <TextField
            id="orderComment"
            label="Comment"
            variant="outlined"
            name="comment"
            value={inputValue.comment}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.comment}</Text>
        )}
      </TableCell>
      <TableCell
        align="center"
        component="th"
        scope="row"
        sx={{ padding: "10px 5px" }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          {inputValue.isEdit ? (
            <>
              <Button onClick={onClickSave}>
                <Text bold="true">Save</Text>
              </Button>
              <Button color="warning" onClick={onClickClose}>
                <Text bold="true">Close</Text>
              </Button>
              <Button color="info" onClick={handleCancel}>
                <Text bold="true">Cancel</Text>
              </Button>
            </>
          ) : (
            <Button onClick={handleEditOrder}>
              <Text bold="true">Edit</Text>
            </Button>
          )}
        </Stack>
      </TableCell>
    </StyledTableRow>
  );
};

const Row = memo(
  ({ data, isOdd, onAddOrder, onCloseTrade, onSaveOrder, onCloseOrder }) => {
    const [selectedImage, setSelectedImage] = useState(false);

    return (
      <>
        <Dialog
          onClose={() => setSelectedImage(false)}
          open={selectedImage ? true : false}
          maxWidth="xl"
        >
          <img src={selectedImage} />
        </Dialog>

        <StyledTableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          backgroundcolor={isOdd ? "gray" : "white"}
        >
          <TableCell component="th" scope="row">
            <Text bold={open ? 1 : 0}>{data.product.name}</Text>
          </TableCell>
          <TableCell align="center">
            <Text bold={open ? 1 : 0}>{data.type}</Text>
          </TableCell>
          {timeFrame.map((tf) => (
            <TableCell align="center" key={tf}>
              <Avatar
                alt={tf}
                src={data[tf] ? API_URI + data[tf].url : null}
                variant="square"
                sx={{
                  margin: "auto",
                  cursor: data[tf] ? "pointer" : "not-allowed",
                }}
                onClick={() =>
                  data[tf]
                    ? setSelectedImage(API_URI + data[tf].url)
                    : setSelectedImage(false)
                }
              >
                {tf}
              </Avatar>
            </TableCell>
          ))}
          <TableCell align="center">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Button onClick={onAddOrder}>
                <Text bold="true">Add Order</Text>
              </Button>
              <Button color="error">
                <Text bold="true" onClick={onCloseTrade}>
                  Close Trade
                </Text>
              </Button>
            </Stack>
          </TableCell>
        </StyledTableRow>
        {!_.isEmpty(data.orders) && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Box sx={{ margin: 1 }}>
                <Table aria-label="opentrades">
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
                        <Text bold="true">Open Price</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Stop Loss</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Take Profit</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Close Time</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Close Price</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Swap</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center">
                        <Text bold="true">Profit</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center"></StyledSubTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.orders.map((order, index) => (
                      <OrderRow
                        data={order}
                        key={`orderRow${index}`}
                        onSaveOrder={() => onSaveOrder(index)}
                        onCloseOrder={() => onCloseOrder(index)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
);

export const TradesTable = ({
  data,
  onAddOrder,
  onCloseTrade,
  onSaveOrder,
  onCloseOrder,
}) => {
  const [selectedTrade, setSelectedTrade] = useState(false);

  const handleCloseConfirmDialog = () => {
    setSelectedTrade(false);
  };
  const handleConfirm = () => {
    onCloseTrade(selectedTrade.id);
    setSelectedTrade(false);
  };

  return (
    <>
      <ConfirmDialog
        open={selectedTrade ? true : false}
        title={`Confirm close trade ${selectedTrade?.product?.name}`}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirm}
      />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Text bold="true">Product</Text>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Text bold="true">Type</Text>
              </StyledTableCell>
              {timeFrame.map((tf) => (
                <StyledTableCell align="center" key={tf}>
                  <Text bold="true">{tf}</Text>
                </StyledTableCell>
              ))}
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!_.isEmpty(data) &&
              data.map((trade, index) => (
                <Row
                  key={trade.id}
                  data={trade}
                  isOdd={index % 2 == 0}
                  onAddOrder={() => onAddOrder(trade.id)}
                  onCloseTrade={() => setSelectedTrade(trade)}
                  onSaveOrder={onSaveOrder}
                  onCloseOrder={onCloseOrder}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
