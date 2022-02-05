import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSnackbar } from "notistack";

import { Text, TradesTable, ConfirmDialog } from "../../component/index";

import {
  GET_TRADE,
  createOrders,
  deleteOrders,
  updateOrders,
  closeTrade,
  deleteTrade,
  createOrderChange,
  updateOrderChange,
  deleteOrderChange,
} from "../../services";

import { formatOrders } from "../../utils/format";

const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [openTrades, setOpenTrades] = useState([]);

  const {
    data: openTradeData,
    error: openTradeError,
    refetch: openTradeRefetch,
  } = useQuery(GET_TRADE, { variables: { open: true } });

  useEffect(() => {
    if (openTradeError) {
      enqueueSnackbar(openTradeError, { variant: "error" });
    }

    if (openTradeData) {
      let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));

      setOpenTrades(newTrades);
    }
  }, [openTradeData, openTradeError]);

  useEffect(() => {
    openTradeRefetch();
  }, []);

  const handleAddOrder = async (id) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));

    const findTradeIndex = newTrades.findIndex((trade) => trade.id === id);

    newTrades[findTradeIndex].orders.push({
      tradeId: id,
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
      isEdit: true,
    });

    setOpenTrades(newTrades);
  };

  const handleRemoveNewOrder = (tradeId, orderIndex) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));

    const findTradeIndex = newTrades.findIndex((trade) => trade.id === tradeId);

    newTrades[findTradeIndex].orders.splice(orderIndex, 1);

    setOpenTrades(newTrades);
  };

  const handleSaveOrder = async (value) => {
    const variables = {
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
      open: value.open,
    };
    try {
      let res;
      if (value.id) {
        res = await updateOrders(value.id, variables);
      } else {
        res = await createOrders({ ...variables, trade: value.tradeId });
      }

      if (res.status === 200) {
        enqueueSnackbar(`Order ${value.id ? "Updated" : "Created"}`, {
          variant: "success",
        });
        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(
        `${value.id ? "Update" : "Create"} Order error: ${
          error.response.data.message
        }`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleCloseTrade = async (trade) => {
    const orders = trade.orders;

    if (_.isEmpty(orders)) {
      enqueueSnackbar(`Cannot close trade with empty order`, {
        variant: "error",
      });
      return;
    }

    if (_.some(orders, { open: true })) {
      enqueueSnackbar(
        `Cannot close trade, Order ${
          _.find(orders, { open: true }).ticket
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
      enqueueSnackbar(`Close Trade error: ${error.response.data.message}`, {
        variant: "error",
      });
    }
  };
  const handleDeleteTrade = async (trade) => {
    const orders = trade.orders;
    if (!_.isEmpty(orders)) {
      enqueueSnackbar(`Cannot delete trade, Please delete all order first`, {
        variant: "error",
      });
      return;
    }

    try {
      const res = await deleteTrade(trade.id);

      if (res.status === 200) {
        enqueueSnackbar("Trade Deleted", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(`Delete Trade error: ${error.response.data.message}`, {
        variant: "error",
      });
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
      enqueueSnackbar(`Delete Order error: ${error.response.data.message}`, {
        variant: "error",
      });
    }
  };

  const handleCloseOrder = async (id, value) => {
    try {
      const res = await updateOrders(id, { open: value });
      if (res.status === 200) {
        enqueueSnackbar(`Order ${value ? "Open" : "Closed"}`, {
          variant: "success",
        });
        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(
        `Order ${value ? "Open" : "Closed"} error: ${
          error.response.data.message
        }`,
        { variant: "error" }
      );
    }
  };

  const handleAddOrderChange = async (tradeId, orderId) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));

    const findTradeIndex = newTrades.findIndex((trade) => trade.id === tradeId);

    const findOrderIndex = newTrades[findTradeIndex].orders.findIndex(
      (order) => order.id === orderId
    );

    newTrades[findTradeIndex].orders[findOrderIndex].order_changes.push({
      orderId: orderId,
      takeProfit: undefined,
      stopLoss: undefined,
      comment: "",
      isEdit: true,
    });

    setOpenTrades(newTrades);
  };

  const handleRemoveNewOrderChange = (tradeId, orderId, orderChangeIndex) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));

    const findTradeIndex = newTrades.findIndex((trade) => trade.id === tradeId);

    const findOrderIndex = newTrades[findTradeIndex].orders.findIndex(
      (order) => order.id === orderId
    );

    newTrades[findTradeIndex].orders[findOrderIndex].order_changes.splice(
      orderChangeIndex,
      1
    );

    setOpenTrades(newTrades);
  };

  const handleSaveOrderChange = async (value) => {
    const variables = {
      stopLoss: value.stopLoss,
      takeProfit: value.takeProfit,
      comment: value.comment,
    };

    try {
      let res;

      if (value.id) {
        res = await updateOrderChange(value.id, variables);
      } else {
        res = await createOrderChange({ ...variables, order: value.orderId });
      }

      if (res.status === 200) {
        enqueueSnackbar("Order change updated", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(
        `Add order change error: ${error.response.data.message}`,
        { variant: "error" }
      );
    }
  };

  const handleDeleteOrderChange = async (id) => {
    try {
      const res = await deleteOrderChange(id);

      if (res.status === 200) {
        enqueueSnackbar("Order change deleted", { variant: "success" });
        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(
        `Delete order change error: ${error.response.data.message}`,
        { variant: "error" }
      );
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
              onRemoveNewOrder={handleRemoveNewOrder}
              onSaveOrder={handleSaveOrder}
              onCloseTrade={handleCloseTrade}
              onDeleteTrade={handleDeleteTrade}
              onClickDeleteOrder={handleDeleteOrder}
              onCloseOrder={handleCloseOrder}
              onClickAddOrderChange={handleAddOrderChange}
              onRemoveNewOrderChange={handleRemoveNewOrderChange}
              onSaveOrderChange={handleSaveOrderChange}
              onDeleteOrderChange={handleDeleteOrderChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(HomePage);
