import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";

import { Text, TradesTable, ConfirmDialog } from "../../component/index";

import { alertSuccess, alertError } from "../../redux/alertSlice";

import {
  GET_PENDING_ORDERS,
  GET_OPEN_TRADE,
  createOrders,
  deleteOrders,
  updateOrders,
  closeTrade,
} from "../../services";

import { formatOrders } from "../../utils/format";

const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [openTrades, setOpenTrades] = useState([]);
  const [newOrder, setNewOrder] = useState({});

  const {
    data: openTradeData,
    error: openTradeError,
    refetch: openTradeRefetch,
  } = useQuery(GET_OPEN_TRADE);

  useEffect(() => {
    if (openTradeError) {
      enqueueSnackbar(openTradeError, { variant: "error" });
    }

    if (openTradeData && !_.isEmpty(openTradeData.trades)) {
      if (_.isEmpty(newOrder)) {
        setOpenTrades(openTradeData.trades);
      } else {
        const newTrade = JSON.parse(JSON.stringify(openTradeData.trades));
        console.log("newTrade", newTrade);
        const findTradeIndex = newTrade.findIndex(
          (trade) => trade.id === newOrder.trade
        );
        console.log("findTradeIndex", findTradeIndex);
        const findOrderIndex = openTradeData.trades[
          findTradeIndex
        ].orders.findIndex((order) => order.id === newOrder.order);
        console.log("findOrderIndex", findOrderIndex);
        newTrade[findTradeIndex].orders[findOrderIndex] = {
          ...newTrade[findTradeIndex].orders[findOrderIndex],
          isEdit: true,
        };
        setOpenTrades(newTrade);
      }
    }
  }, [openTradeData, openTradeError]);

  const handleAddOrder = async (id) => {
    try {
      const res = await createOrders({
        trade: id,
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
      });
      if (res.status === 200) {
        setNewOrder({ trade: id, order: res.data.id });
        openTradeRefetch();
      } else {
        throw new Error(res);
      }
    } catch (error) {
      console.log("Add order:", error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleSaveOrder = async (value) => {
    try {
      const res = await updateOrders(value.id, {
        ticket: value.ticket,
        type: value.type,
        size: value.size,
        openTime: value.openTime,
        closeTime: value.closeTime,
        openPrice: value.openPrice,
        closePrice: value.closePrice,
        stopLoss: value.stopLoss,
        takeProfit: value.takeProfit,
        swap: value.swap,
        profit: value.profit,
        comment: value.comment,
      });
      if (res.status === 200) {
        enqueueSnackbar("Order Updated", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      console.log("Update Order error", error.response);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const handleCloseTrade = async (trade) => {
    const orders = trade.orders;
    if (
      _.some(orders, { ticket: "" }) ||
      _.some(orders, { size: 0 }) ||
      _.some(orders, { openTime: null }) ||
      _.some(orders, { closeTime: null }) ||
      _.some(orders, { openPrice: 0 }) ||
      _.some(orders, { closePrice: 0 }) ||
      _.some(orders, { stopLoss: 0 }) ||
      _.some(orders, { takeProfit: 0 })
    ) {
      enqueueSnackbar(
        `Cannot close trade, order ${
          (_.find(orders, { ticket: "" }) && "undefined") ||
          _.find(orders, { size: 0 }).ticket ||
          _.find(orders, { openTime: null }).ticket ||
          _.find(orders, { closeTime: null }).ticket ||
          _.find(orders, { openPrice: 0 }).ticket ||
          _.find(orders, { closePrice: 0 }).ticket ||
          _.find(orders, { stopLoss: 0 }).ticket ||
          _.find(orders, { takeProfit: 0 }).ticket
        } still open`,
        {
          variant: "error",
        }
      );
      return;
    }

    try {
      const res = await closeTrade(trade.id);

      if (res.status === 200) {
        enqueueSnackbar("Trade Closed", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      console.log("Close Trade error", error.response);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const res = await deleteOrders(id);
      if (res.status === 200) {
        enqueueSnackbar("Order Deleted", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      console.log("Delete Order error", error.response);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
      <div>
        <Text
          bold="true"
          color="blue"
          fontSize="25px"
          sx={{ marginBottom: "10px" }}
        >
          Open Trade
        </Text>
        <Card>
          <CardContent>
            <TradesTable
              data={openTrades}
              onAddOrder={handleAddOrder}
              onSaveOrder={handleSaveOrder}
              onCloseTrade={handleCloseTrade}
              onClickDeleteOrder={handleDeleteOrder}
            />
          </CardContent>
        </Card>
      </div>
      {/* 
      <div>
        <Text fontSize="20px" bold="true">
          Pending Orders
        </Text>
        <Card>
          <CardContent>
            <TradesTable orders={pendingOrders} />
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default memo(HomePage);
