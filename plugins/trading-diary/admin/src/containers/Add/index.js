import React, { memo, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import _ from "lodash";

import { styled } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";

import pluginId from "../../pluginId";
import {
  Text,
  Button,
  Autocomplete,
  HelperText,
  Select,
  TextField,
} from "../../component/index";

import { GET_PRODUCTS, uploadMedia, createTrade } from "../../services";

import { timeFrame } from "../../instance";

const Add = ({ history }) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageArr, setImageArr] = useState([]);
  const [inputValue, setInputValue] = useState({
    product: null,
    type: "buy",
    comment: "",
  });

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

    const objectUrl = URL.createObjectURL(file);

    const newImageArr = imageArr.slice();
    newImageArr.push({ tf: name, file: file, preview: objectUrl });
    setImageArr(newImageArr);

    setErrors(errors.filter((error) => error.property !== "image"));

    e.target.value = null;
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
    setLoading(true);
    const newError = [];

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
    if (!_.isEmpty(newError)) {
      setLoading(false);
      return;
    }

    try {
      const res = await createTrade({
        product: inputValue.product.id,
        comment: inputValue.comment,
        type: inputValue.type,
        open: true,
      });

      if (res.status !== 200) {
        throw new Error(res);
      }

      await Promise.all(
        imageArr.map(async (i) => {
          const formData = new FormData();
          formData.append("files", i.file);
          formData.append("ref", "trade");
          formData.append("refId", res.data.id);
          formData.append("field", i.tf);

          await uploadMedia(formData);
        })
      );

      history.push(`/plugins/${pluginId}`);
    } catch (error) {
      console.log("handleCreate error", error);
    }
  };

  /*---------- Fetch Product ----------*/
  const [products, setProducts] = useState([]);
  const {
    data: productsData,
    error: productsError,
    loading: productLoading,
  } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (productsError) {
      console.log("productsError", productsError);
    }
    if (productsData && !_.isEmpty(productsData.products)) {
      setProducts(
        _.sortBy(
          productsData.products.map((p) => ({
            ...p,
            value: p.id,
            label: p.name,
          })),
          ["type", "name"]
        )
      );
    }
  }, [productsData, productsError]);

  return (
    <Box sx={{ position: "relative" }}>
      <Text
        bold="true"
        color="blue"
        fontSize="25px"
        sx={{ marginBottom: "10px" }}
      >
        Create Trade
      </Text>
      <Card>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", rowGap: "20px" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "20px",
            }}
          >
            {timeFrame.map((tf) => (
              <Card key={`imageUploader${tf}`}>
                <CardContent>
                  <ImageUploader component="form">
                    <ImageContainer>
                      <Image src={imageArr.find((i) => i.tf === tf)?.preview} />
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
                        <Button
                          variant="contained"
                          component="span"
                          disabled={loading || productLoading}
                          sx={{ width: "100%" }}
                        >
                          {tf}
                        </Button>
                      </Label>
                      {imageArr.find((i) => i.tf === tf) && (
                        <Button
                          variant="contained"
                          color="error"
                          component="span"
                          onClick={() => handleDeleteImage(tf)}
                          disabled={loading || productLoading}
                          sx={{ width: "100%" }}
                        >
                          Delete
                        </Button>
                      )}
                    </ButtonContainer>
                  </ImageUploader>
                  {errors.find((e) => e.property === "image") && (
                    <HelperText>
                      {errors.find((e) => e.property === "image").message}
                    </HelperText>
                  )}
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardContent>
                <Box
                  component="form"
                  autoComplete="off"
                  sx={{
                    display: "flex",
                    rowGap: "20px",
                    flexDirection: "column",
                  }}
                >
                  <Autocomplete
                    required
                    id="product"
                    options={products}
                    disabled={_.isEmpty(products)}
                    name="product"
                    onChange={(_, newValue) => {
                      handleProductChange(newValue);
                    }}
                    label="Product"
                    disabled={loading || productLoading}
                    error={
                      errors.find((e) => e.property === "product")?.message
                    }
                  />
                  <Select
                    required
                    labelId="type"
                    id="type"
                    label="Type"
                    name="type"
                    value={inputValue.type}
                    onChange={handleChange}
                    error={errors.find((e) => e.property === "type")?.message}
                    disabled={loading || productLoading}
                    options={[
                      { value: "buy", label: "Buy" },
                      { value: "sell", label: "Sell" },
                    ]}
                  />

                  <TextField
                    required
                    id="tradeComment"
                    name="comment"
                    label="Comment"
                    error={
                      errors.find((e) => e.property === "comment")?.message
                    }
                    value={inputValue.comment}
                    onChange={handleChange}
                    disabled={loading || productLoading}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Button
            variant="contained"
            onClick={handleCreate}
            loading={loading || productLoading}
          >
            Create
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default memo(Add);

const Input = styled("input")({
  display: "none",
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

const ButtonContainer = styled("div")({
  width: "100%",
  display: "flex",
});
