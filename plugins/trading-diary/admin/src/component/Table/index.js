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
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ArchiveIcon from "@mui/icons-material/Archive";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import HistoryIcon from "@mui/icons-material/History";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Tooltip from "@mui/material/Tooltip";
import AddchartIcon from "@mui/icons-material/Addchart";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";

import { averagePrice } from "../../utils/format";

import {
  Text,
  Button,
  ConfirmDialog,
  Select,
  HelperText,
  StrategyCheckbox,
  NoInformation,
} from "../index";

import { timeFrame, strategies } from "../../constant";

import {
  StyledTableCell,
  StyledTableRow,
  StyledSubTableCell,
  OrderTableCell,
} from "./style";

const OrderRow = ({
  canEdit,
  tradeId,
  data,
  onRemoveNewOrder,
  onSaveOrder,
  onCloseOrder,
  onClickDeleteOrder,
}) => {
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    ticket: "",
    size: "",
    openTime: null,
    closeTime: null,
    openPrice: "",
    closePrice: "",
    stopLoss: "",
    takeProfit: "",
    swap: "",
    profit: "",
    comment: "",
    type: "buy",
    open: true,
    isEdit: false,
  });

  const reset = () => {
    const {
      id,
      ticket,
      size,
      openTime,
      closeTime,
      openPrice,
      closePrice,
      takeProfit,
      stopLoss,
      swap,
      profit,
      comment,
      type,
      open,
      isEdit,
    } = data;
    setInputValue({
      tradeId: tradeId,
      id: id,
      ticket: ticket || "",
      size: size || "",
      openTime: openTime || null,
      closeTime: closeTime || null,
      openPrice: openPrice || "",
      closePrice: closePrice || "",
      stopLoss: stopLoss || "",
      takeProfit: takeProfit || "",
      swap: swap || "",
      profit: profit || "",
      comment: comment || "",
      type: type,
      open: open,
      isEdit: isEdit,
    });
  };

  useEffect(() => {
    reset();
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

    if (inputValue.size === "") {
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

    if (inputValue.openPrice === "") {
      newErrors.push({
        property: "openPrice",
        message: "Please provide a open price",
      });
    }

    if (inputValue.closePrice === "") {
      newErrors.push({
        property: "closePrice",
        message: "Please provide a close price",
      });
    }

    if (inputValue.profit === "") {
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
              autoComplete="off"
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
              <MobileDateTimePicker
                autoComplete="off"
                ampm={false}
                disableFuture
                maxDate={moment(inputValue.closeTime)}
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
                label="Open Time"
                onError={errors.find((e) => e.property === "openTime")?.message}
                renderInput={(props) => <TextField {...props} />}
              />
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
                { value: "sellLimit", label: "Sell Limit" },
                { value: "buyLimit", label: "Buy Limit" },
                { value: "sellStop", label: "Sell Stop" },
                { value: "buyStop", label: "Buy Stop" },
              ]}
            />
          ) : (
            <Text>{inputValue.type}</Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <TextField
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <>
              <MobileDateTimePicker
                autoComplete="off"
                ampm={false}
                disableFuture
                minDate={moment(inputValue.openTime)}
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
                label="Close Time"
                onError={
                  errors.find((e) => e.property === "closeTime")?.message
                }
                renderInput={(props) => <TextField {...props} />}
              />
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
              autoComplete="off"
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
              autoComplete="off"
              id="orderSwap"
              label="Swap"
              variant="outlined"
              name="swap"
              type="number"
              value={inputValue.swap}
              onChange={handleChange}
            />
          ) : (
            <Text color={inputValue.swap < 0 ? "red" : "blue"}>
              {inputValue.swap}
            </Text>
          )}
        </OrderTableCell>
        <OrderTableCell isedit={inputValue.isEdit ? 1 : 0}>
          {inputValue.isEdit ? (
            <TextField
              autoComplete="off"
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
            <Text color={inputValue.profit < 0 ? "red" : "blue"}>
              {inputValue.profit}
            </Text>
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
                  <Tooltip placement="top" arrow title="Save">
                    <IconButton color="primary" onClick={onClickSave}>
                      <SaveAsIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip placement="top" arrow title="Cancel">
                    <IconButton color="info" onClick={handleCancel}>
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  {inputValue.open && (
                    <>
                      <Tooltip placement="top" arrow title="Edit Order">
                        <IconButton color="info" onClick={onClickEditOrder}>
                          <ModeEditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip placement="top" arrow title="Delete Order">
                        <IconButton color="error" onClick={() => setOpen(true)}>
                          <DeleteForeverIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip
                    placement="top"
                    arrow
                    title={inputValue.open ? "Close Order" : "Open Order"}
                  >
                    <IconButton color="primary" onClick={onClickClose}>
                      {inputValue.open ? (
                        <MeetingRoomIcon />
                      ) : (
                        <NoMeetingRoomIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </OrderTableCell>
        )}
      </StyledTableRow>
      <StyledTableRow>
        <OrderTableCell
          sx={{
            width: "100%",
            padding: "0 15px",
          }}
          colSpan={13}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: "10px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text fontSize="14px">{`created at: ${moment(data.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            )},`}</Text>
            <Text fontSize="14px">{` updated at: ${moment(
              data.updatedAt
            ).format("YYYY-MM-DD HH:mm:ss")}`}</Text>
          </Box>
        </OrderTableCell>
      </StyledTableRow>
      {inputValue.isEdit ? (
        <StyledTableRow>
          <OrderTableCell
            isedit={inputValue.isEdit ? 1 : 0}
            sx={{
              overflowWrap: "break-word",
              width: "100%",
            }}
            colSpan={13}
          >
            <TextField
              sx={{
                overflowWrap: "break-word",
                width: "100%",
              }}
              autoComplete="off"
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
          </OrderTableCell>
        </StyledTableRow>
      ) : inputValue.comment !== "" ? (
        <StyledTableRow>
          <OrderTableCell
            isedit={inputValue.isEdit ? 1 : 0}
            sx={{
              overflowWrap: "break-word",
              width: "100%",
            }}
            colSpan={13}
          >
            <Text
              sx={{
                textAlign: "justify",
                overflowWrap: "break-word",
                width: "100%",
                whiteSpace: "pre-line",
              }}
              color="blue"
            >
              {inputValue.comment}
            </Text>
          </OrderTableCell>
        </StyledTableRow>
      ) : (
        <></>
      )}
    </>
  );
};

const TradeUpdateRow = memo(
  ({
    tradeId,
    data,
    index,
    onSaveTradingUpdate,
    onCancelTradingUpdate,
    onDeleteTradingUpdate,
  }) => {
    const [errors, setErrors] = useState([]);
    const [selectedImage, setSelectedImage] = useState(false);
    const [open, setOpen] = useState(false);
    const [imageArr, setImageArr] = useState([]);
    const [comment, setComment] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [deleteImage, setDeleteImage] = useState([]);
    const [strategiesInput, setStrategiesInput] = useState({
      support: false,
      resistant: false,
      srFlip: false,
      demand: false,
      supply: false,
      fakeout: false,
      fibo: false,
      qml: false,
      iqml: false,
      pa: false,
      orderBlock: false,
    });

    const reset = () => {
      if (data.id) {
        const newImageArr = [];
        const newStratigies = {};
        const strategiesArr = strategies.map((s) => s.name);

        for (const key in data) {
          if (timeFrame.includes(key)) {
            if (data[key]) {
              newImageArr.push({
                tf: key,
                preview: API_URI + data[key].url,
                id: data[key].id,
              });
            }
          }

          if (strategiesArr.includes(key)) {
            newStratigies[key] = data[key];
          }
        }

        setStrategiesInput(newStratigies);
        setImageArr(newImageArr);
      } else {
        setImageArr(data.imageArr);
      }
      setComment(data.comment);
      setIsEdit(data.isEdit);
    };

    useEffect(() => {
      reset();
    }, [data]);

    const handleChange = (e) => {
      const value = e.target.value;
      setComment(value);
      setErrors(errors.filter((error) => error.property !== name));
    };

    const handleStratigiesChange = (e) => {
      const name = e.target.name;
      const newStratigies = { ...strategiesInput };
      newStratigies[name] = event.target.checked;
      setStrategiesInput(newStratigies);
    };

    const onImageChange = async (e) => {
      if (e.target.files.length === 0) return;
      const name = e.target.name;
      const file = e.target.files[0];

      const objectUrl = URL.createObjectURL(file);

      const newImageArr = imageArr.slice();

      const imageIndex = newImageArr.findIndex((i) => i.tf === name);

      if (imageIndex !== -1 && newImageArr[imageIndex].hasOwnProperty("id")) {
        const newDeleteImage = deleteImage.slice();
        newDeleteImage.push({ [name]: newImageArr[imageIndex].id });
        setDeleteImage(newDeleteImage);
      }

      if (imageIndex !== -1) {
        newImageArr.splice(imageIndex, 1);
      }

      newImageArr.push({ tf: name, file: file, preview: objectUrl });
      setImageArr(newImageArr);

      setErrors(errors.filter((error) => error.property !== "image"));

      e.target.value = null;
      return () => URL.revokeObjectURL(objectUrl);
    };

    const handleDeleteImage = (tf) => {
      const newImageArr = imageArr.slice();

      const imageIndex = newImageArr.findIndex((i) => i.tf === tf);
      if (imageIndex !== -1 && newImageArr[imageIndex].hasOwnProperty("id")) {
        const newDeleteImage = deleteImage.slice();
        newDeleteImage.push({ [tf]: newImageArr[imageIndex].id });
        setDeleteImage(newDeleteImage);
      }

      newImageArr.splice(imageIndex, 1);
      setImageArr(newImageArr);
    };

    const onClickSave = async () => {
      const newError = [];

      if (!comment) {
        newError.push({
          property: "comment",
          message: "Please provide a comment",
        });
      }

      if (_.isEmpty(imageArr)) {
        newError.push({
          property: "image",
          message: "Please provide a image",
        });
      }

      setErrors(newError);
      if (!_.isEmpty(newError)) {
        return;
      }
      setIsEdit(false);
      onSaveTradingUpdate({
        tradeId,
        id: data.id,
        comment,
        index,
        imageArr,
        deleteImage,
        strategiesInput,
      });
    };

    const onClickCancel = () => {
      if (data.id) {
        reset();
      } else {
        onCancelTradingUpdate({ tradeId, index });
      }
    };

    const onClickEdit = () => {
      setIsEdit(true);
    };

    const onClickConfirm = () => {
      onDeleteTradingUpdate(data);
      setOpen(false);
    };

    return (
      <>
        <Dialog
          onClose={() => setSelectedImage(false)}
          open={selectedImage ? true : false}
          maxWidth="xl"
        >
          <img src={selectedImage || null} />
        </Dialog>
        <ConfirmDialog
          open={open}
          title={`Confirm delete Trading Update`}
          onClose={() => setOpen(false)}
          onConfirm={onClickConfirm}
        />
        <TableRow>
          {/* <OrderTableCell isedit={isEdit ? 1 : 0}>
            <Text sx={{ textAlign: "left" }}>{data?.id}</Text>
          </OrderTableCell> */}
          {timeFrame.map((tf) => (
            <OrderTableCell align="center" key={tf}>
              <Box component="form">
                <Box>
                  <Avatar
                    src={imageArr.find((i) => i.tf === tf)?.preview}
                    variant="square"
                    sx={{
                      width: "auto",
                      margin: "auto",
                      cursor: imageArr.find((i) => i.tf === tf)
                        ? "pointer"
                        : "not-allowed",
                    }}
                    onClick={() =>
                      setSelectedImage(
                        imageArr.find((i) => i.tf === tf)?.preview
                      )
                    }
                  >
                    {tf}
                  </Avatar>
                </Box>
                {isEdit && (
                  <Box>
                    <label htmlFor={`${tf}-input`} alt={tf}>
                      <input
                        accept="image/*"
                        id={`${tf}-input`}
                        type="file"
                        name={tf}
                        onChange={onImageChange}
                        style={{ display: "none" }}
                      />
                      <Button variant="contained" component="span">
                        {tf}
                      </Button>
                    </label>
                    {imageArr.find((i) => i.tf === tf) && (
                      <Button
                        variant="contained"
                        color="error"
                        component="span"
                        onClick={() => handleDeleteImage(tf)}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
              {errors.find((e) => e.property === "image") && (
                <HelperText>
                  {errors.find((e) => e.property === "image").message}
                </HelperText>
              )}
            </OrderTableCell>
          ))}
          <OrderTableCell>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {isEdit ? (
                <>
                  <Tooltip placement="top" arrow title="Save">
                    <IconButton color="primary" onClick={onClickSave}>
                      <SaveAsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip placement="top" arrow title="Cancel">
                    <IconButton color="info" onClick={onClickCancel}>
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip placement="top" arrow title="Edit Trading Update">
                    <IconButton color="info" onClick={onClickEdit}>
                      <ModeEditIcon />
                    </IconButton>
                  </Tooltip>
                  {data.id && (
                    <Tooltip
                      placement="top"
                      arrow
                      title="Delete Trading Update"
                    >
                      <IconButton color="error" onClick={() => setOpen(true)}>
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Stack>
          </OrderTableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ padding: "0 15px" }} colSpan={13}>
            {isEdit ? (
              <StrategyCheckbox
                onChange={handleStratigiesChange}
                data={strategiesInput}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "10px",
                  }}
                >
                  {strategies.map((strategy) => (
                    <Box
                      key={strategy.name}
                      sx={{
                        display: "flex",
                        columnGap: "3px",
                        alignItems: "center",
                      }}
                    >
                      {strategiesInput[strategy.name] ? (
                        <CheckCircleRoundedIcon
                          color="success"
                          style={{ fontSize: "14px" }}
                        />
                      ) : (
                        <CancelRoundedIcon
                          color="error"
                          style={{ fontSize: "14px" }}
                        />
                      )}
                      <Text
                        sx={{ marginTop: "3px" }}
                        fontSize="14px"
                        color={strategiesInput[strategy.name] ? "green" : "red"}
                      >
                        {strategy.label}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    columnGap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Text fontSize="14px">{`created at: ${moment(
                    data.createdAt
                  ).format("YYYY-MM-DD HH:mm:ss")},`}</Text>
                  <Text fontSize="14px">{` updated at: ${moment(
                    data.updatedAt
                  ).format("YYYY-MM-DD HH:mm:ss")}`}</Text>
                </Box>
              </Box>
            )}
          </TableCell>
        </TableRow>
        {isEdit ? (
          <TableRow>
            <TableCell style={{ padding: "5px 15px" }} colSpan={13}>
              <TextField
                required
                multiline
                fullWidth
                autoComplete="off"
                id="tradeComment"
                name="comment"
                label="Comment"
                error={errors.find((e) => e.property === "comment")?.message}
                value={comment}
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
        ) : comment !== "" ? (
          <TableRow>
            <TableCell style={{ padding: "5px 15px" }} colSpan={13}>
              <Text sx={{ wordBreak: "break-word", whiteSpace: "pre-line " }}>
                {comment}
              </Text>
            </TableCell>
          </TableRow>
        ) : (
          <></>
        )}
      </>
    );
  }
);

const TradeRow = memo(
  ({
    canEdit,
    data,
    onAddTradingUpdate,
    onSaveTradingUpdate,
    onCancelTradingUpdate,
    onDeleteTradingUpdate,
    onAddOrder,
    onCloseTrade,
    onDeleteTrade,
    onReOpenTrade,
    onRemoveNewOrder,
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
          sx={{
            "& > *": { borderBottom: "unset" },
          }}
          backgroundcolor="gray"
        >
          <OrderTableCell component="th" scope="row">
            <Text bold="true">{data.product.name}</Text>
          </OrderTableCell>
          <OrderTableCell>
            <Text bold="true">{data.bias}</Text>
          </OrderTableCell>
          {timeFrame.map((tf) => (
            <OrderTableCell align="center" key={tf}>
              <Avatar
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
            </OrderTableCell>
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
                  <Tooltip placement="top" arrow title="Add Update Trade">
                    <IconButton color="info" onClick={onAddTradingUpdate}>
                      <AddchartIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip placement="top" arrow title="Add Order">
                    <IconButton color="primary" onClick={onAddOrder}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip placement="top" arrow title="Close Trade">
                    <IconButton color="success" onClick={onCloseTrade}>
                      <ArchiveIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip placement="top" arrow title="Delete Trade">
                    <IconButton color="error" onClick={onDeleteTrade}>
                      <DeleteSweepIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip placement="top" arrow title="Re-Open Trade">
                  <IconButton color="primary" onClick={onReOpenTrade}>
                    <CheckCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </TableCell>
        </StyledTableRow>
        <TableRow>
          <TableCell style={{ padding: "0 15px" }} colSpan={13}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "10px",
                }}
              >
                {strategies.map((strategy) => (
                  <Box
                    key={strategy.name}
                    sx={{
                      display: "flex",
                      columnGap: "3px",
                      alignItems: "center",
                    }}
                  >
                    {data[strategy.name] ? (
                      <CheckCircleRoundedIcon
                        color="success"
                        style={{ fontSize: "14px" }}
                      />
                    ) : (
                      <CancelRoundedIcon
                        color="error"
                        style={{ fontSize: "14px" }}
                      />
                    )}
                    <Text
                      sx={{ marginTop: "3px" }}
                      fontSize="14px"
                      color={data[strategy.name] ? "green" : "red"}
                    >
                      {strategy.label}
                    </Text>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  columnGap: "10px",
                  alignItems: "center",
                }}
              >
                <Text fontSize="14px">{`created at: ${moment(
                  data.createdAt
                ).format("YYYY-MM-DD HH:mm:ss")},`}</Text>
                <Text fontSize="14px">{` updated at: ${moment(
                  data.updatedAt
                ).format("YYYY-MM-DD HH:mm:ss")}`}</Text>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ padding: "15px" }} colSpan={13}>
            <Text sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {data.comment}
            </Text>
          </TableCell>
        </TableRow>

        {!_.isEmpty(data.trading_updates) && (
          <StyledTableRow>
            <TableCell style={{ padding: "15px" }} colSpan={13}>
              <Box>
                <Table aria-label="opentrades">
                  <TableHead>
                    <TableRow>
                      {/* <StyledTableCell backgroundcolor="lineGreen">
                        <Text bold="true">Update ID</Text>
                      </StyledTableCell> */}
                      {timeFrame.map((tf) => (
                        <StyledTableCell
                          backgroundcolor="lineGreen"
                          align="center"
                          key={tf}
                        >
                          <Text bold="true">{tf}</Text>
                        </StyledTableCell>
                      ))}
                      <StyledTableCell backgroundcolor="lineGreen" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.trading_updates.map((update, index) => (
                      <TradeUpdateRow
                        tradeId={data.id}
                        data={update}
                        key={`tradeUpdate${index}`}
                        index={index}
                        onSaveTradingUpdate={onSaveTradingUpdate}
                        onCancelTradingUpdate={onCancelTradingUpdate}
                        onDeleteTradingUpdate={onDeleteTradingUpdate}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableCell>
          </StyledTableRow>
        )}
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
  onAddTradingUpdate,
  onSaveTradingUpdate,
  onCancelTradingUpdate,
  onDeleteTradingUpdate,
  onAddOrder,
  onCloseTrade,
  onDeleteTrade,
  onRemoveNewOrder,
  onSaveOrder,
  onCloseOrder,
  onClickDeleteOrder,
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
    setSelectedDeleteTrade(false);
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
        title={`Confirm delete trade`}
        onClose={handleDeleteConfirmDialog}
        onConfirm={handleConfirmDelete}
      />

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell backgroundcolor="black">
                <Text bold="true">Product</Text>
              </StyledTableCell>
              <StyledTableCell backgroundcolor="black" align="center">
                <Text bold="true">Bias</Text>
              </StyledTableCell>
              {timeFrame.map((tf) => (
                <StyledTableCell
                  backgroundcolor="black"
                  align="center"
                  key={tf}
                >
                  <Text bold="true">{tf}</Text>
                </StyledTableCell>
              ))}
              <StyledTableCell backgroundcolor="black" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!_.isEmpty(data) ? (
              data.map((trade) => (
                <TradeRow
                  canEdit={trade.open}
                  key={trade.id}
                  data={trade}
                  onCloseTrade={() => setSelectedTrade(trade)}
                  onReOpenTrade={() => setSelectedTrade(trade)}
                  onDeleteTrade={() => setSelectedDeleteTrade(trade)}
                  onAddTradingUpdate={() => onAddTradingUpdate(trade.id)}
                  onSaveTradingUpdate={onSaveTradingUpdate}
                  onCancelTradingUpdate={onCancelTradingUpdate}
                  onDeleteTradingUpdate={onDeleteTradingUpdate}
                  onAddOrder={() => onAddOrder(trade.id)}
                  onRemoveNewOrder={onRemoveNewOrder}
                  onSaveOrder={onSaveOrder}
                  onCloseOrder={onCloseOrder}
                  onClickDeleteOrder={onClickDeleteOrder}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12}>
                  <NoInformation />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
