import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

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

import { Text, TradesTable } from "../../component/index";

import {
  GET_PENDING_ORDERS,
  GET_PRODUCTS,
  GET_OPEN_TRADE,
} from "../../services";

import { formatOrders } from "../../utils/format";

const HomePage = () => {
  const [openTrades, setOpenTrades] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const {
    data: openTradeData,
    error: openTradeError,
    loading: openTradeLoading,
  } = useQuery(GET_OPEN_TRADE);

  useEffect(() => {
    if (openTradeError) {
      console.log("openTradeError", openTradeError);
    }

    if (openTradeData && !_.isEmpty(openTradeData.trades)) {
      setOpenTrades(openTradeData.trades);
    }
  }, [openTradeData, openTradeError]);

  // const {
  //   data: pendingOrdersData,
  //   error: pendingOrdersError,
  //   loading: pendingOrdersLoading,
  // } = useQuery(GET_PENDING_ORDERS);

  // useEffect(() => {
  //   if (pendingOrdersError) {
  //     console.log("pendingOrdersError", pendingOrdersError);
  //   }
  //   if (pendingOrdersData && !_.isEmpty(pendingOrdersData.orders)) {
  //     const newPendingOrders = formatOrders(pendingOrdersData.orders);
  //     console.log("pendingOrdersData", pendingOrdersData.orders);
  //     setPendingOrders(newPendingOrders);
  //   }
  // }, [pendingOrdersData, pendingOrdersError]);

  const handleAddOrder = (id) => {
    let newOpenTrades = JSON.parse(JSON.stringify(openTrades));
    const tradeIndex = newOpenTrades.findIndex((t) => t.id === id);
    newOpenTrades[tradeIndex].orders.push({
      ticket: "",
      type: newOpenTrades[tradeIndex].type,
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
      isEdit: true,
    });
    setOpenTrades(newOpenTrades);
  };

  useEffect(() => {
    console.log("openTrades", openTrades);
  }, [openTrades]);

  const handleSaveOrder = (id, value) => {
    console.log("handleSaveOrder", id, value);
  };

  const handleCloseTrade = (id, value) => {
    console.log("handleCloseTrade", id, value);
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
