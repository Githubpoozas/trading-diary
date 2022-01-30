import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { Text, OrdersTable } from "../../component/index";

import {
  GET_OPEN_ORDERS,
  GET_PENDING_ORDERS,
  GET_PRODUCTS,
} from "../../services";

import { formatOrders } from "../../utils/format";

const HomePage = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  // const {
  //   data: productsData,
  //   error: productsError,
  //   loading: productsLoading,
  // } = useQuery(GET_PRODUCTS);

  // useEffect(() => {
  //   if (productsError) {
  //     console.log("productsError", productsError);
  //   }
  //   if (productsData && !_.isEmpty(productsData.products)) {
  //     console.log("products", productsData.products);
  //   }
  // }, [productsData, productsError]);

  const { data: openOrdersData, error: openOrdersError } =
    useQuery(GET_OPEN_ORDERS);

  useEffect(() => {
    if (openOrdersError) {
      console.log("openOrdersError", openOrdersError);
    }
    if (openOrdersData && !_.isEmpty(openOrdersData.orders)) {
      const newOpenOrders = formatOrders(openOrdersData.orders);
      setOpenOrders(newOpenOrders);
    }
  }, [openOrdersData, openOrdersError]);

  const {
    data: pendingOrdersData,
    error: pendingOrdersError,
    loading: pendingOrdersLoading,
  } = useQuery(GET_PENDING_ORDERS);

  useEffect(() => {
    if (pendingOrdersError) {
      console.log("pendingOrdersError", pendingOrdersError);
    }
    if (pendingOrdersData && !_.isEmpty(pendingOrdersData.orders)) {
      const newPendingOrders = formatOrders(pendingOrdersData.orders);
      console.log("pendingOrdersData", pendingOrdersData.orders);
      setPendingOrders(newPendingOrders);
    }
  }, [pendingOrdersData, pendingOrdersError]);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
      <div>
        <Text fontSize="20px" bold="true">
          Open Orders
        </Text>
        <Card>
          <CardContent>
            <OrdersTable orders={openOrders} />
          </CardContent>
        </Card>
      </div>

      <div>
        <Text fontSize="20px" bold="true">
          Pending Orders
        </Text>
        <Card>
          <CardContent>
            <OrdersTable orders={pendingOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(HomePage);
