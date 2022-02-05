import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSnackbar } from "notistack";

import { Text, TradesTable, ConfirmDialog } from "../../component/index";

import { GET_TRADE, reOpenCloseTrade } from "../../services";

const History = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [closeTrades, setCloseTrades] = useState([]);

  const {
    data: closeTradeData,
    error: closeTradeError,
    refetch: closeTradeRefetch,
  } = useQuery(GET_TRADE, { variables: { open: false } });

  useEffect(() => {
    if (closeTradeError) {
      enqueueSnackbar(closeTradeError, { variant: "error" });
    }

    if (closeTradeData) {
      let newTrades = JSON.parse(JSON.stringify(closeTradeData.trades));

      setCloseTrades(newTrades);
    }
  }, [closeTradeData, closeTradeError]);

  useEffect(() => {
    closeTradeRefetch();
  }, []);

  const handleReOpenTrade = async (id) => {
    try {
      const res = await reOpenCloseTrade(id);

      if (res.status === 200) {
        enqueueSnackbar("Trade re-opened", { variant: "success" });
        closeTradeRefetch();
      }
    } catch (error) {
      enqueueSnackbar(`re-open trade error: ${error.response.data.message}`, {
        variant: "error",
      });
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
          History
        </Text>
        <Card>
          <CardContent>
            <TradesTable data={closeTrades} onReOpenTrade={handleReOpenTrade} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(History);
