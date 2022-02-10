import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSnackbar } from "notistack";

import {
  Text,
  TradesTable,
  ConfirmDialog,
  Progress,
} from "../../component/index";

import {
  GET_TRADE,
  deleteMedia,
  uploadMedia,
  createOrders,
  deleteOrders,
  updateOrders,
  closeTrade,
  deleteTrade,
  createTradingUpdate,
  updateTradingUpdate,
  deleteTradingUpdate,
} from "../../services";

import { formatOrders } from "../../utils/format";

import { timeFrame } from "../../constant";

const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [openTrades, setOpenTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    data: openTradeData,
    error: openTradeError,
    refetch: openTradeRefetch,
    loading: openTradeLoading,
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

  const handleCloseTrade = async (trade) => {
    // const orders = trade.orders;

    // if (_.isEmpty(orders)) {
    //   enqueueSnackbar(`Cannot close trade with empty order`, {
    //     variant: "error",
    //   });
    //   return;
    // }

    // if (_.some(orders, { open: true })) {
    //   enqueueSnackbar(
    //     `Cannot close trade, Order ${
    //       _.find(orders, { open: true }).ticket
    //     } still open`,
    //     {
    //       variant: "error",
    //     }
    //   );
    //   return;
    // }

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
    if (!_.isEmpty(trade.trading_updates)) {
      enqueueSnackbar(
        `Cannot delete trade, Please delete all trading update first`,
        {
          variant: "error",
        }
      );
      return;
    }
    if (!_.isEmpty(trade.orders)) {
      enqueueSnackbar(`Cannot delete trade, Please delete all order first`, {
        variant: "error",
      });
      return;
    }
    setLoading(true);

    try {
      const res = await deleteTrade(trade.id);

      if (res.status === 200) {
        enqueueSnackbar("Trade Deleted", { variant: "success" });

        const deleteImageArr = [];
        for (const key in trade) {
          if (timeFrame.includes(key) && trade[key]) {
            deleteImageArr.push(trade[key].id);
          }
        }

        await Promise.all(
          deleteImageArr.map(async (i) => {
            await deleteMedia(i);
          })
        );

        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(`Delete Trade error: ${error.response.data.message}`, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const handleAddTradingUpdate = (id) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));
    const findTradeIndex = newTrades.findIndex((trade) => trade.id === id);
    newTrades[findTradeIndex].trading_updates.push({
      comment: "",
      imageArr: [],
      isEdit: true,
      strategies: {
        trendFollowing: false,
        againstTrend: false,
        support: false,
        resistant: false,
        dynamic: false,
        multiple: false,
        drastic: false,
        srFlip: false,
        demand: false,
        supply: false,
        fakeout: false,
        fibo: false,
      },
    });
    setOpenTrades(newTrades);
  };

  const handleCancelTradingUpdate = (data) => {
    let newTrades = JSON.parse(JSON.stringify(openTradeData.trades));
    const findTradeIndex = newTrades.findIndex(
      (trade) => trade.id === data.tradeId
    );
    newTrades[findTradeIndex].trading_updates.splice(data.index, 1);
    setOpenTrades(newTrades);
  };

  const handleSaveTradingUpdate = async (data) => {
    const deleteImageObj = {};
    const deleteImageArr = [];

    data.deleteImage.forEach((item) => {
      for (const property in item) {
        deleteImageObj[property] = null;
        deleteImageArr.push(item[property]);
      }
    });

    setLoading(true);

    try {
      let res;

      if (data.id) {
        res = await updateTradingUpdate(data.id, {
          trade: data.tradeId,
          comment: data.comment,
          ...data.strategiesInput,
          ...deleteImageObj,
        });
      } else {
        res = await createTradingUpdate({
          trade: data.tradeId,
          comment: data.comment,
          ...data.strategiesInput,
        });
      }

      if (res.status !== 200) {
        throw new Error(res);
      }

      if (res.status === 200) {
        enqueueSnackbar(`Trading Update ${data.id ? "updated" : "created"}`, {
          variant: "success",
        });

        await Promise.all(
          data.imageArr.map(async (i) => {
            if (i.hasOwnProperty("id")) return;
            const formData = new FormData();
            formData.append("files", i.file);
            formData.append("ref", "trading-update");
            formData.append("refId", res.data.id);
            formData.append("field", i.tf);

            await uploadMedia(formData);
          })
        );

        await Promise.all(
          deleteImageArr.map(async (i) => {
            await deleteMedia(i);
          })
        );

        openTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(
        `Update Trading Update error: ${error.response.data.message}`,
        {
          variant: "error",
        }
      );
    }
    setLoading(false);
  };

  const handleDeleteTradingUpdate = async (tradingUpdate) => {
    setLoading(true);

    try {
      const res = await deleteTradingUpdate(tradingUpdate.id);

      if (res.status === 200) {
        enqueueSnackbar(`Trading Update Deleted`, {
          variant: "success",
        });

        const deleteImageArr = [];
        for (const key in tradingUpdate) {
          if (timeFrame.includes(key) && tradingUpdate[key]) {
            deleteImageArr.push(tradingUpdate[key].id);
          }
        }

        await Promise.all(
          deleteImageArr.map(async (i) => {
            await deleteMedia(i);
          })
        );
      }
      openTradeRefetch();
    } catch (error) {
      enqueueSnackbar(
        `Delete Trading Update error: ${error.response.data.message}`,
        {
          variant: "error",
        }
      );
    }
    setLoading(false);
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
    let orderVariables = {
      ticket: ticket,
      type: type,
      size: size !== "" ? size : null,
      openTime: openTime,
      closeTime: closeTime !== "" ? closeTime : null,
      openPrice: openPrice !== "" ? openPrice : null,
      closePrice: closePrice !== "" ? closePrice : null,
      swap: swap !== "" ? swap : null,
      profit: profit !== "" ? profit : null,
      comment: comment,
      open: open,
      stopLoss: stopLoss !== "" ? stopLoss : null,
      takeProfit: takeProfit !== "" ? takeProfit : null,
    };

    setLoading(true);

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
        openTradeRefetch();
      }
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
    setLoading(false);
  };

  const handleDeleteOrder = async (id) => {
    setLoading(true);

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
    setLoading(false);
  };

  const handleCloseOrder = async (id, value) => {
    setLoading(true);

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
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
        position: "relative",
      }}
    >
      {(loading || openTradeLoading) && <Progress />}
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
              onCloseTrade={handleCloseTrade}
              onDeleteTrade={handleDeleteTrade}
              onAddTradingUpdate={handleAddTradingUpdate}
              onSaveTradingUpdate={handleSaveTradingUpdate}
              onCancelTradingUpdate={handleCancelTradingUpdate}
              onDeleteTradingUpdate={handleDeleteTradingUpdate}
              onAddOrder={handleAddOrder}
              onRemoveNewOrder={handleRemoveNewOrder}
              onSaveOrder={handleSaveOrder}
              onClickDeleteOrder={handleDeleteOrder}
              onCloseOrder={handleCloseOrder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(HomePage);
