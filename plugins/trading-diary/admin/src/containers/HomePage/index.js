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
  uploadMedia,
} from "../../services";

import { formatOrders } from "../../utils/format";

const Input = styled("input")({
  display: "none",
});

const StyledCard = styled(Card)({
  // width: "300px",
  // height: "300px",
});

const StyledCardContent = styled(CardContent)({});

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

const ImageContainer = styled("div")({});

const Label = styled("label")({
  margin: 0,
  width: "100%",
});

const Image = styled("img")({
  width: "100%",
});
const StyledButton = styled(Button)({
  width: "100%",
});
const ButtonContainer = styled("div")({
  width: "100%",
  display: "flex",
});

const StyledAutocomplete = styled(Autocomplete)(({ theme, error }) => ({
  [`& .MuiOutlinedInput-notchedOutline`]: {
    borderColor: error && "red",
  },
}));

const timeFrame = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN"];

const HomePage = () => {
  const [errors, setErrors] = useState([]);
  const [inputValue, setInputValue] = useState({
    product: null,
    type: "",
    comment: "",
  });

  const [imageArr, setImageArr] = useState([]);

  const [openOrders, setOpenOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const handleProductChange = (value) => {
    setInputValue({
      ...inputValue,
      product: value,
    });

    setErrors(errors.filter((error) => error.property !== "product"));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    console.log(name, value);

    setInputValue({
      ...inputValue,
      [name]: value,
    });

    setErrors(errors.filter((error) => error.property !== name));
  };

  const onImageChange = async (e) => {
    if (e.target.files.length === 0) return;
    const name = e.target.name;
    const file = e.target.files[0];

    console.log("file", file);

    const objectUrl = URL.createObjectURL(file);

    const newImageArr = imageArr.slice();
    newImageArr.push({ tf: name, file: objectUrl });
    setImageArr(newImageArr);

    setErrors(errors.filter((error) => error.property !== "image"));

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleDeleteImage = (tf) => {
    const newImageArr = imageArr.slice();
    newImageArr.splice(
      newImageArr.findIndex((i) => i.tf === tf),
      1
    );
    setImageArr(newImageArr);
  };

  const handleCreate = async () => {
    const newError = [];

    console.log("inputValue", inputValue);

    if (!inputValue.product) {
      newError.push({
        property: "product",
        message: "Please provide a product",
      });
    }

    if (!inputValue.type) {
      newError.push({
        property: "type",
        message: "Please provide a type",
      });
    }

    if (!inputValue.comment) {
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
    if (!_.isEmpty(newError)) return;

    const imageUploadRes = await Promise.all(
      imageArr.map(async (i) => {
        const formData = new FormData();
        formData.append("files", i.file);
        formData.append("ref", "trade");
        formData.append("refId", getDoctorData.staff.user.id);
        formData.append("field", i.tf);

        return await uploadMedia(formData);
      })
    );

    console.log("imageUploadRes", imageUploadRes);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
      <Card>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
        >
          <Text bold="true">Create Trade</Text>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "20px",
            }}
          >
            {timeFrame.map((tf) => (
              <StyledCard key={`imageUploader${tf}`}>
                <StyledCardContent>
                  <ImageUploader component="form">
                    <ImageContainer>
                      <Image src={imageArr.find((i) => i.tf === tf)?.file} />
                    </ImageContainer>
                    <ButtonContainer>
                      <Label htmlFor={`${tf}-input`} alt={tf}>
                        <Input
                          accept="image/*"
                          id={`${tf}-input`}
                          type="file"
                          name={tf}
                          onChange={onImageChange}
                        />
                        <StyledButton variant="contained" component="span">
                          {tf}
                        </StyledButton>
                      </Label>
                      {imageArr.find((i) => i.tf === tf) && (
                        <StyledButton
                          variant="contained"
                          color="error"
                          component="span"
                          onClick={() => handleDeleteImage(tf)}
                        >
                          Delete
                        </StyledButton>
                      )}
                    </ButtonContainer>
                  </ImageUploader>
                  {errors.find((e) => e.property === "image") && (
                    <FormHelperText error>
                      {errors.find((e) => e.property === "image").message}
                    </FormHelperText>
                  )}
                </StyledCardContent>
              </StyledCard>
            ))}
            <StyledCard>
              <StyledCardContent>
                <Box
                  component="form"
                  autoComplete="off"
                  sx={{
                    display: "flex",
                    rowGap: "20px",
                    flexDirection: "column",
                  }}
                >
                  <FormControl fullWidth>
                    <StyledAutocomplete
                      required
                      id="product"
                      options={products}
                      name="product"
                      onChange={(_, newValue) => {
                        handleProductChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Product" />
                      )}
                      error={errors.find((e) => e.property === "product")}
                    />
                    {errors.find((e) => e.property === "product") && (
                      <FormHelperText error>
                        {errors.find((e) => e.property === "product").message}
                      </FormHelperText>
                    )}
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
                      error={errors.find((e) => e.property === "type")}
                    >
                      <MenuItem value="buy">Buy</MenuItem>
                      <MenuItem value="sell">Sell</MenuItem>
                    </Select>
                    {errors.find((e) => e.property === "type") && (
                      <FormHelperText error>
                        {errors.find((e) => e.property === "type").message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      required
                      autoComplete="off"
                      id="tradeComment"
                      name="comment"
                      label="Comment"
                      helperText={
                        errors.find((e) => e.property === "comment")?.message
                      }
                      error={errors.find((e) => e.property === "comment")}
                      multiline
                      fullWidth
                      value={inputValue.comment}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Box>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
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
