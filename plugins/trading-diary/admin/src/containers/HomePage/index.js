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

import { Text, OrdersTable } from "../../component/index";

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

    if (openTradeData) {
      console.log("openTradeData", openTradeData);
    }

    if (openTradeData && !_.isEmpty(openTradeData.trades)) {
      console.log("openTradeData.trade", openTradeData.trades);
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
            <OrdersTable orders={openTrades} />
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
            <OrdersTable orders={pendingOrders} />
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default memo(HomePage);
