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
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { averagePrice } from "../../utils/format";

import { Text, Button, ConfirmDialog, Select, HelperText } from "../index";

import { timeFrame } from "../../instance";

import {
  StyledTableCell,
  StyledTableRow,
  StyledSubTableCell,
  OrderTableCell,
} from "./style";

const OrderChangeRow = ({
  canEdit,
  data,
  tradeId,
  orderId,
  orderChangeIndex,
  onRemoveNewOrderChange,
  onSaveOrderChange,
  onDeleteOrderChange,
}) => {
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    stopLoss: undefined,
    takeProfit: undefined,
    comment: "",
    isEdit: false,
  });

  useEffect(() => {
    setInputValue(data);
  }, [data]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (parseFloat(value) < 0) {
      return;
    }
    setInputValue({
      ...inputValue,
      [name]: value,
    });

    setErrors(errors.filter((error) => error.property !== name));
  };

  const onClickSave = () => {
    onSaveOrderChange(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };

  const handleCancel = () => {
    if (data.orderId) {
      onRemoveNewOrderChange(tradeId, orderId, orderChangeIndex);
    } else {
      setInputValue({
        ...data,
        isEdit: false,
      });
    }
  };

  const onClickEditOrderChange = () => {
    setInputValue({
      ...inputValue,
      isEdit: true,
    });
  };

  const onClickConfirm = () => {
    onDeleteOrderChange(data.id);
    setInputValue({ ...inputValue, isEdit: false });
    setOpen(false);
  };

  return (
    <StyledTableRow>
      <ConfirmDialog
        open={open}
        title={`Confirm delete order change`}
        onClose={() => setOpen(false)}
        onConfirm={onClickConfirm}
      />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
        {inputValue.isEdit ? (
          <TextField
            autoComplete="off"
            id="orderStopLoss"
            label="Stop Loss"
            variant="outlined"
            name="stopLoss"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.stopLoss}
            onChange={handleChange}
            error={errors.find((e) => e.property === "stopLoss") ? true : false}
            helperText={errors.find((e) => e.property === "stopLoss")?.message}
          />
        ) : (
          <Text>{inputValue.stopLoss}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
        {inputValue.isEdit ? (
          <TextField
            autoComplete="off"
            id="orderTakeProfit"
            label="Take Profit"
            variant="outlined"
            name="takeProfit"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={inputValue.takeProfit}
            onChange={handleChange}
            error={
              errors.find((e) => e.property === "takeProfit") ? true : false
            }
            helperText={
              errors.find((e) => e.property === "takeProfit")?.message
            }
          />
        ) : (
          <Text>{inputValue.takeProfit}</Text>
        )}
      </OrderTableCell>
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell />
      <OrderTableCell
        isedit={inputValue.isEdit ? 1 : 0}
        sx={{
          overflowWrap: "break-word",
          width: "400px",
          maxWidth: "400px",
        }}
      >
        {inputValue.isEdit ? (
          <TextField
            sx={{
              width: "400px",
              maxWidth: "400px",
            }}
            multiline
            id="orderComment"
            label="Comment"
            variant="outlined"
            name="comment"
            value={inputValue.comment}
            onChange={handleChange}
            error={errors.find((e) => e.property === "comment") ? true : false}
            helperText={errors.find((e) => e.property === "comment")?.message}
          />
        ) : (
          <Text sx={{ textAlign: "justify" }}>{inputValue.comment}</Text>
        )}
      </OrderTableCell>
      {canEdit && (
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            {inputValue.isEdit ? (
              <>
                <IconButton color="primary" onClick={onClickSave}>
                  <SaveAsIcon />
                </IconButton>
                <IconButton color="info" onClick={handleCancel}>
                  <HistoryIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton color="info" onClick={onClickEditOrderChange}>
                  <ModeEditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => setOpen(true)}>
                  <DeleteForeverIcon />
                </IconButton>
              </>
            )}
          </Stack>
        </OrderTableCell>
      )}
    </StyledTableRow>
  );
};

const OrderRow = ({
  canEdit,
  tradeId,
  data,
  onRemoveNewOrder,
  onSaveOrder,
  onCloseOrder,
  onClickDeleteOrder,
  onClickAddOrderChange,
  onRemoveNewOrderChange,
  onSaveOrderChange,
  onDeleteOrderChange,
}) => {
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    ticket: "",
    size: undefined,
    openTime: null,
    closeTime: null,
    openPrice: undefined,
    closePrice: undefined,
    stopLoss: undefined,
    takeProfit: undefined,
    swap: undefined,
    profit: undefined,
    comment: "",
    type: "buy",
    open: true,
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

    setErrors(errors.filter((error) => error.property !== name));
  };

  const handleCancel = () => {
    if (data.tradeId) {
      onRemoveNewOrder();
    } else {
      setInputValue({ ...data, isEdit: false });
    }
  };

  const onClickEditOrder = () => {
    setInputValue({ ...inputValue, isEdit: true });
  };

  const onClickSave = () => {
    onSaveOrder(inputValue);
    setInputValue({ ...inputValue, isEdit: false });
  };

  const onClickClose = () => {
    const newErrors = [];
    if (inputValue.ticket === "") {
      newErrors.push({
        property: "ticket",
        message: "Please provide a ticket",
      });
    }

    if (inputValue.size === 0) {
      newErrors.push({
        property: "size",
        message: "Please provide a size",
      });
    }

    if (inputValue.openTime === null) {
      newErrors.push({
        property: "openTime",
        message: "Please provide a open time",
      });
    }

    if (inputValue.closeTime === null) {
      newErrors.push({
        property: "closeTime",
        message: "Please provide a closeTime",
      });
    }

    if (inputValue.openPrice === 0) {
      newErrors.push({
        property: "openPrice",
        message: "Please provide a open price",
      });
    }

    if (inputValue.closePrice === 0) {
      newErrors.push({
        property: "closePrice",
        message: "Please provide a close price",
      });
    }

    if (inputValue.profit === 0) {
      newErrors.push({
        property: "profit",
        message: "Please provide a profit",
      });
    }

    if (inputValue.comment === "") {
      newErrors.push({
        property: "comment",
        message: "Please provide a comment",
      });
    }

    if (!_.isEmpty(newErrors)) {
      setErrors(newErrors);
      setInputValue({ ...inputValue, isEdit: true });
      return;
    }

    onCloseOrder(data.id, !data.open);
  };

  const onClickConfirm = () => {
    onClickDeleteOrder(data.id);
    setOpen(false);
  };

  return (
    <>
      <StyledTableRow closed={!inputValue.open ? 1 : 0}>
        <ConfirmDialog
          open={open}
          title={`Confirm close order`}
          onClose={() => setOpen(false)}
          onConfirm={onClickConfirm}
        />
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={errors.find((e) => e.property === "ticket") ? true : false}
              helperText={errors.find((e) => e.property === "ticket")?.message}
            />
          ) : (
            <Text>{inputValue.ticket}</Text>
          )}
        </OrderTableCell>

        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <>
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
                  setErrors(
                    errors.filter((error) => error.property !== "openTime")
                  );
                }}
              />
              {errors.find((e) => e.property === "openTime") && (
                <HelperText>
                  {errors.find((e) => e.property === "openTime")?.message}
                </HelperText>
              )}
            </>
          ) : (
            <Text>
              {moment(inputValue.openTime).format("YYYY.MM.DD HH:mm")}
            </Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={errors.find((e) => e.property === "size") ? true : false}
              helperText={errors.find((e) => e.property === "size")?.message}
            />
          ) : (
            <Text>{inputValue.size}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={
                errors.find((e) => e.property === "openPrice") ? true : false
              }
              helperText={
                errors.find((e) => e.property === "openPrice")?.message
              }
            />
          ) : (
            <Text>{inputValue.openPrice}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={
                errors.find((e) => e.property === "stopLoss") ? true : false
              }
              helperText={
                errors.find((e) => e.property === "stopLoss")?.message
              }
            />
          ) : (
            <Text>{inputValue.stopLoss}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={
                errors.find((e) => e.property === "takeProfit") ? true : false
              }
              helperText={
                errors.find((e) => e.property === "takeProfit")?.message
              }
            />
          ) : (
            <Text>{inputValue.takeProfit}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <>
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
                  setErrors(
                    errors.filter((error) => error.property !== "closeTime")
                  );
                }}
              />
              {errors.find((e) => e.property === "closeTime") && (
                <HelperText>
                  {errors.find((e) => e.property === "closeTime")?.message}
                </HelperText>
              )}
            </>
          ) : (
            <Text>
              {moment(inputValue.closeTime).format("YYYY.MM.DD HH:mm")}
            </Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
              error={
                errors.find((e) => e.property === "closePrice") ? true : false
              }
              helperText={
                errors.find((e) => e.property === "closePrice")?.message
              }
            />
          ) : (
            <Text>{inputValue.closePrice}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
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
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <TextField
              id="orderProfit"
              label="Profit"
              variant="outlined"
              name="profit"
              type="number"
              value={inputValue.profit}
              onChange={handleChange}
              error={errors.find((e) => e.property === "profit") ? true : false}
              helperText={errors.find((e) => e.property === "profit")?.message}
            />
          ) : (
            <Text>{inputValue.profit}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell
          isedit={inputValue.isEdit ? 1 : 0}
          sx={{
            overflowWrap: "break-word",
            width: "400px",
            maxWidth: "400px",
          }}
        >
          {inputValue.isEdit ? (
            <TextField
              sx={{
                overflowWrap: "break-word",
                width: "400px",
                maxWidth: "400px",
              }}
              multiline
              id="orderComment"
              label="Comment"
              variant="outlined"
              name="comment"
              value={inputValue.comment}
              onChange={handleChange}
              error={
                errors.find((e) => e.property === "comment") ? true : false
              }
              helperText={errors.find((e) => e.property === "comment")?.message}
            />
          ) : (
            <Text sx={{ textAlign: "justify" }}>{inputValue.comment}</Text>
          )}
        </OrderTableCell>
        {canEdit && (
          <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {inputValue.isEdit ? (
                <>
                  <IconButton color="primary" onClick={onClickSave}>
                    <SaveAsIcon />
                  </IconButton>
                  <IconButton color="info" onClick={handleCancel}>
                    <HistoryIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  {inputValue.open && (
                    <>
                      <IconButton
                        color="info"
                        onClick={() => onClickAddOrderChange(tradeId, data.id)}
                      >
                        <PriceCheckIcon />
                      </IconButton>
                      <IconButton color="info" onClick={onClickEditOrder}>
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => setOpen(true)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton color="primary" onClick={onClickClose}>
                    {inputValue.open ? (
                      <MeetingRoomIcon />
                    ) : (
                      <NoMeetingRoomIcon />
                    )}
                  </IconButton>
                </>
              )}
            </Stack>
          </OrderTableCell>
        )}
      </StyledTableRow>
      {!_.isEmpty(data.order_changes) &&
        data.order_changes.map((change, index) => (
          <OrderChangeRow
            canEdit={canEdit}
            key={`OrderChangeRow${index}`}
            data={change}
            tradeId={tradeId}
            orderId={data.id}
            orderChangeIndex={index}
            onRemoveNewOrderChange={onRemoveNewOrderChange}
            onSaveOrderChange={onSaveOrderChange}
            onDeleteOrderChange={onDeleteOrderChange}
          />
        ))}
    </>
  );
};

const TradeRow = memo(
  ({
    canEdit,
    data,
    onAddOrder,
    onCloseTrade,
    onDeleteTrade,
    onReOpenTrade,
    onRemoveNewOrder,
    onSaveOrder,
    onCloseOrder,
    onClickDeleteOrder,
    onClickAddOrderChange,
    onRemoveNewOrderChange,
    onSaveOrderChange,
    onDeleteOrderChange,
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
          sx={{
            "& > *": { borderBottom: "unset" },
          }}
          backgroundcolor="gray"
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
                  width: "auto",
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
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {canEdit ? (
                <>
                  <IconButton color="primary" onClick={onAddOrder}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <IconButton color="error" onClick={onCloseTrade}>
                    <HighlightOffIcon />
                  </IconButton>
                  <IconButton color="error" onClick={onDeleteTrade}>
                    <DeleteSweepIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton color="primary" onClick={onReOpenTrade}>
                  <CheckCircleOutlineIcon />
                </IconButton>
              )}
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
                      {canEdit && (
                        <StyledSubTableCell align="center"></StyledSubTableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.orders.map((order, index) => (
                      <OrderRow
                        canEdit={canEdit}
                        tradeId={data.id}
                        data={order}
                        key={`orderRow${index}`}
                        onRemoveNewOrder={() =>
                          onRemoveNewOrder(data.id, index)
                        }
                        onSaveOrder={onSaveOrder}
                        onCloseOrder={onCloseOrder}
                        onClickDeleteOrder={onClickDeleteOrder}
                        onClickAddOrderChange={onClickAddOrderChange}
                        onRemoveNewOrderChange={onRemoveNewOrderChange}
                        onSaveOrderChange={onSaveOrderChange}
                        onDeleteOrderChange={onDeleteOrderChange}
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
  onDeleteTrade,
  onRemoveNewOrder,
  onSaveOrder,
  onCloseOrder,
  onClickDeleteOrder,
  onClickAddOrderChange,
  onRemoveNewOrderChange,
  onSaveOrderChange,
  onDeleteOrderChange,
  onReOpenTrade,
}) => {
  const [selectedTrade, setSelectedTrade] = useState(false);
  const [selectedDeleteTrade, setSelectedDeleteTrade] = useState(false);

  const handleCloseConfirmDialog = () => {
    setSelectedTrade(false);
  };
  const handleConfirm = () => {
    if (selectedTrade.open) {
      onCloseTrade(selectedTrade);
    } else {
      onReOpenTrade(selectedTrade.id);
    }
    setSelectedTrade(false);
  };

  const handleDeleteConfirmDialog = () => {
    setSelectedTrade(false);
  };
  const handleConfirmDelete = () => {
    onDeleteTrade(selectedDeleteTrade);
    setSelectedDeleteTrade(false);
  };

  return (
    <>
      <ConfirmDialog
        open={selectedTrade ? true : false}
        title={`Confirm ${selectedTrade.open ? "close" : "re-open"} trade ${
          selectedTrade?.product?.name
        }`}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirm}
      />
      <ConfirmDialog
        open={selectedDeleteTrade ? true : false}
        title={`Confirm ${selectedTrade.open ? "close" : "re-open"} trade ${
          selectedDeleteTrade?.product?.name
        }`}
        onClose={handleDeleteConfirmDialog}
        onConfirm={handleConfirmDelete}
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
                <TradeRow
                  canEdit={trade.open}
                  key={trade.id}
                  data={trade}
                  onAddOrder={() => onAddOrder(trade.id)}
                  onCloseTrade={() => setSelectedTrade(trade)}
                  onReOpenTrade={() => setSelectedTrade(trade)}
                  onDeleteTrade={() => setSelectedDeleteTrade(trade)}
                  onRemoveNewOrder={onRemoveNewOrder}
                  onSaveOrder={onSaveOrder}
                  onCloseOrder={onCloseOrder}
                  onClickDeleteOrder={onClickDeleteOrder}
                  onClickAddOrderChange={onClickAddOrderChange}
                  onRemoveNewOrderChange={onRemoveNewOrderChange}
                  onSaveOrderChange={onSaveOrderChange}
                  onDeleteOrderChange={onDeleteOrderChange}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
