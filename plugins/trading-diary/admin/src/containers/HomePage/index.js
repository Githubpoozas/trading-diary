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
  GET_OPEN_ORDERS,
  GET_PENDING_ORDERS,
  GET_PRODUCTS,
} from "../../services";

import { formatOrders } from "../../utils/format";

const Input = styled("input")({
  display: "none",
});

const ImageUploaderContainer = styled("div")({
  display: "flex",
  columnGap: "20px",
  rowGap: "20px",
  // flexWrap: "wrap",
  flexDirection: "column",
});

const ImageUploader = styled("div")({
  width: "auto",
  display: "flex",
  rowGap: "10px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const ImageContainer = styled("div")({
  // width: "300px",
  // height: "300px",
  border: "1px solid gray",
});

const Image = styled("img")({
  width: "100%",
});

const timeFrame = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN"];

const HomePage = () => {
  const [inputValue, setInputValue] = useState({
    product: null,
    type: "",
    comment: "",
    M1: null,
    M5: null,
    M15: null,
    M30: null,
    H1: null,
    H4: null,
    D1: null,
    W1: null,
    MN: null,
  });

  const [openOrders, setOpenOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const onImageChange = (e) => {
    console.log("onImageChange", e.target.name, e.target.files[0]);
    const name = e.target.name;
    const file = e.target.files[0];

    const objectUrl = URL.createObjectURL(file);
    setInputValue({
      ...inputValue,
      [name]: objectUrl,
    });
    return () => URL.revokeObjectURL(objectUrl);
  };

  const {
    data: productsData,
    error: productsError,
    loading: productsLoading,
  } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (productsError) {
      console.log("productsError", productsError);
    }
    if (productsData && !_.isEmpty(productsData.products)) {
      setProducts(
        productsData.products.map((p) => ({ ...p, value: p.id, label: p.name }))
      );
    }
  }, [productsData, productsError]);

  // const { data: openOrdersData, error: openOrdersError } =
  //   useQuery(GET_OPEN_ORDERS);

  // useEffect(() => {
  //   if (openOrdersError) {
  //     console.log("openOrdersError", openOrdersError);
  //   }
  //   if (openOrdersData && !_.isEmpty(openOrdersData.orders)) {
  //     const newOpenOrders = formatOrders(openOrdersData.orders);
  //     setOpenOrders(newOpenOrders);
  //   }
  // }, [openOrdersData, openOrdersError]);

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

  useEffect(() => {
    console.log("inputValue", inputValue);
  }, [inputValue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
      <Card>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
        >
          <Text bold="true">Create Trade</Text>
          <Box
            component="form"
            autoComplete="off"
            sx={{ display: "flex", columnGap: "20px" }}
          >
            <FormControl fullWidth>
              <Autocomplete
                required
                id="product"
                options={products}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField {...params} label="Product" />
                )}
              />
              {/* <FormHelperText>1111</FormHelperText> */}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="type">Type</InputLabel>
              <Select
                required
                labelId="type"
                id="type"
                value={inputValue.type}
                label="Type"
                name="type"
                onChange={handleChange}
                // error
              >
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ImageUploaderContainer>
            {timeFrame.map((tf) => (
              <ImageUploader component="form">
                <ImageContainer>
                  <Image src={inputValue[tf]} />
                </ImageContainer>
                <label htmlFor={`${tf}-input`} alt={tf}>
                  <Input
                    accept="image/*"
                    id={`${tf}-input`}
                    type="file"
                    name={tf}
                    onChange={onImageChange}
                  />
                  <Button variant="contained" component="span">
                    {tf}
                  </Button>
                </label>
              </ImageUploader>
            ))}
          </ImageUploaderContainer>
          <Box component="form" autoComplete="off">
            <FormControl fullWidth>
              <TextField
                required
                autoComplete="off"
                id="tradeComment"
                name="comment"
                label="Comment"
                // helperText="Please input Comment"
                // error
                multiline
                fullWidth
                value={inputValue.comment}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
          <Button variant="contained">Create</Button>
        </CardContent>
      </Card>
      {/* <div>
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
      </div> */}
    </div>
  );
};

export default memo(HomePage);
