import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AddTaskIcon from "@mui/icons-material/AddTask";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HistoryIcon from "@mui/icons-material/History";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { averagePrice } from "../../utils/format";

import { Text, Button, ConfirmDialog, Select } from "../index";

import { timeFrame } from "../../instance";

import {
  StyledTableCell,
  StyledTableRow,
  StyledSubTableCell,
  OrderTableCell,
} from "./style";

const OrderRow = ({ data, onSaveOrder, onCloseOrder, onClickDeleteOrder }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    ticket: "",
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
    type: "buy",
    isEdit: false,
  });

  useEffect(() => {
    setInputValue(data);
  }, [data]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (
      ["size", "openPrice", "closePrice", "stopLoss", "takeProfit"].includes(
        name
      ) &&
      parseFloat(value) < 0
    ) {
      return;
    }
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
    console.log("onClickSave", inputValue);
    onSaveOrder(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };
  const onClickClose = () => {
    onCloseOrder(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };

  const onClickConfirm = () => {
    onClickDeleteOrder(data.id);
  };

  return (
    <StyledTableRow>
      <ConfirmDialog
        open={open}
        title={`Confirm close order`}
        onClose={() => setOpen(false)}
        onConfirm={onClickConfirm}
      />
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderTicket"
            label="Ticket"
            variant="outlined"
            name="ticket"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.ticket}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.ticket}</Text>
        )}
      </OrderTableCell>

      <OrderTableCell>
        {inputValue.isEdit ? (
          <DateTimePicker
            ampm={false}
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
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <Select
            required
            labelId="type"
            id="type"
            label="Type"
            name="type"
            value={inputValue.type}
            onChange={handleChange}
            options={[
              { value: "buy", label: "Buy" },
              { value: "sell", label: "Sell" },
            ]}
          />
        ) : (
          <Text>{inputValue.type}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderSize"
            label="Size"
            variant="outlined"
            name="size"
            type="number"
            InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
            value={inputValue.size}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.size}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderOpenPrice"
            label="OpenPrice"
            variant="outlined"
            name="openPrice"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.openPrice}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.openPrice}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderStopLoss"
            label="Stop Loss"
            variant="outlined"
            name="stopLoss"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.stopLoss}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.stopLoss}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderTakeProfit"
            label="Take Profit"
            variant="outlined"
            name="takeProfit"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.takeProfit}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.takeProfit}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <DateTimePicker
            ampm={false}
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
      </OrderTableCell>
      <OrderTableCell>
        {inputValue.isEdit ? (
          <TextField
            id="orderClosePrice"
            label="Close Price"
            variant="outlined"
            name="closePrice"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.closePrice}
            onChange={handleChange}
          />
        ) : (
          <Text>{inputValue.closePrice}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
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
      </OrderTableCell>
      <OrderTableCell>
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
      </OrderTableCell>
      <OrderTableCell
        sx={{
          overflowWrap: "break-word",
          maxWidth: "400px",
        }}
      >
        {inputValue.isEdit ? (
          <TextField
            multiline
            id="orderComment"
            label="Comment"
            variant="outlined"
            name="comment"
            value={inputValue.comment}
            onChange={handleChange}
          />
        ) : (
          <Text sx={{ textAlign: "justify" }}>{inputValue.comment}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          {inputValue.isEdit ? (
            <>
              <IconButton color="primary" onClick={onClickSave}>
                <SaveAsIcon />
              </IconButton>
              {/* <IconButton color="primary" onClick={onClickClose}>
                <ArchiveIcon />
              </IconButton> */}
              <IconButton color="info" onClick={handleCancel}>
                <HistoryIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton color="info" onClick={handleEditOrder}>
                <ModeEditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => setOpen(true)}>
                <DeleteForeverIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </OrderTableCell>
    </StyledTableRow>
  );
};

const Row = memo(
  ({
    data,
    isOdd,
    onAddOrder,
    onCloseTrade,
    onSaveOrder,
    onCloseOrder,
    onClickDeleteOrder,
  }) => {
    const [selectedImage, setSelectedImage] = useState(false);

    return (
      <>
        <Dialog
          onClose={() => setSelectedImage(false)}
          open={selectedImage ? true : false}
          maxWidth="xl"
        >
          <img src={selectedImage || null} />
        </Dialog>

        <StyledTableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          backgroundcolor={isOdd ? "gray" : "white"}
        >
          <TableCell component="th" scope="row">
            <Text bold={open ? 1 : 0}>{data.product.name}</Text>
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
              <IconButton color="primary" onClick={onAddOrder}>
                <AddTaskIcon />
              </IconButton>
              <IconButton color="error" onClick={onCloseTrade}>
                <HighlightOffIcon />
              </IconButton>
            </Stack>
          </TableCell>
        </StyledTableRow>
        {!_.isEmpty(data.orders) && (
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={13}>
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
                        <Text bold="true">Type</Text>
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
                      <StyledSubTableCell align="center">
                        <Text bold="true">Comment</Text>
                      </StyledSubTableCell>
                      <StyledSubTableCell align="center"></StyledSubTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.orders.map((order, index) => (
                      <OrderRow
                        data={order}
                        key={`orderRow${index}`}
                        onSaveOrder={onSaveOrder}
                        onCloseOrder={onCloseOrder}
                        onClickDeleteOrder={onClickDeleteOrder}
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
  onClickDeleteOrder,
}) => {
  const [selectedTrade, setSelectedTrade] = useState(false);

  const handleCloseConfirmDialog = () => {
    setSelectedTrade(false);
  };
  const handleConfirm = () => {
    onCloseTrade(selectedTrade);
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
                  onClickDeleteOrder={onClickDeleteOrder}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
