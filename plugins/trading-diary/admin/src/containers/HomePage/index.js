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
      console.log("newTrades", newTrades);
      setOpenTrades(newTrades);
    }
  }, [openTradeData, openTradeError]);

  useEffect(() => {
    openTradeRefetch();
  }, []);

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

  const handleAddUpdateTrade = (id) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));
    const findTradeIndex = newTrades.findIndex((trade) => trade.id === id);
    newTrades[findTradeIndex].trading_updates.push({
      comment: "",
      imageArr: [],
      isEdit: true,
    });
    setOpenTrades(newTrades);
  };

  const handleCancelUpdateTrade = (data) => {
    console.log("handleCancelUpdateTrade", data);
  };
  const handleSaveUpdateTrade = (data) => {
    console.log("handleSaveUpdateTrade", data);
  };

  const handleAddOrder = async (id) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));
    const findTradeIndex = newTrades.findIndex((trade) => trade.id === id);

    newTrades[findTradeIndex].orders.push({
      tradeId: id,
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

  const handleSaveOrder = async ({
    tradeId,
    id,
    ticket,
    type,
    size,
    openTime,
    closeTime,
    openPrice,
    closePrice,
    swap,
    profit,
    comment,
    open,
    stopLoss,
    takeProfit,
  }) => {
    let canCreateOrderChange = true;
    if (id) {
      let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));
      const findTradeIndex = newTrades.findIndex(
        (trade) => trade.id === tradeId
      );
      const { oldStopLoss, oldTakeProfit } = newTrades[
        findTradeIndex
      ].orders.find((order) => order.id === id);

      if (stopLoss === oldStopLoss && takeProfit === oldTakeProfit) {
        canCreateOrderChange = false;
      }
    }

    let orderVariables = {
      ticket: ticket,
      type: type,
      size: size,
      openTime: openTime,
      closeTime: closeTime,
      openPrice: openPrice,
      closePrice: closePrice !== "" ? closePrice : null,
      swap: swap !== "" ? swap : null,
      profit: profit !== "" ? profit : null,
      comment: comment,
      open: open,
    };
    const orderChangeVariables = {
      stopLoss: stopLoss !== "" ? stopLoss : null,
      takeProfit: takeProfit !== "" ? takeProfit : null,
    };

    if (canCreateOrderChange) {
      orderVariables = { ...orderVariables, ...orderChangeVariables };
    }

    try {
      let res;
      if (id) {
        res = await updateOrders(id, orderVariables);
      } else {
        res = await createOrders({ ...orderVariables, trade: tradeId });
      }

      if (res.status === 200) {
        enqueueSnackbar(`Order ${id ? "Updated" : "Created"}`, {
          variant: "success",
        });

        if (!canCreateOrderChange) return;

        let orderChangeRes;
        if (id) {
          orderChangeRes = await createOrderChange({
            ...orderChangeVariables,
            order: res.data.id,
          });
        } else {
          if (stopLoss || takeProfit) {
            orderChangeRes = await createOrderChange({
              ...orderChangeVariables,
              order: res.data.id,
            });
          }
        }
        if (orderChangeRes.status === 200) {
          enqueueSnackbar("Order change created", { variant: "success" });
        }
      }
      openTradeRefetch();
    } catch (error) {
      enqueueSnackbar(
        `${id ? "Update" : "Create"} Order error: ${
          error.response.data.message
        }`,
        {
          variant: "error",
        }
      );
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
      tradeUpdateId: "",
      takeProfit: "",
      stopLoss: "",
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
              onAddUpdateTrade={handleAddUpdateTrade}
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
              onSaveUpdateTrade={handleSaveUpdateTrade}
              onCancelUpdateTrade={handleCancelUpdateTrade}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(HomePage);
