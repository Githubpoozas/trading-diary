import axios from "axios";
import { gql } from "@apollo/client";

const instance = axios.create({
    baseURL: strapi.baseURL,
  // baseURL: "http://localhost:1337",
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getToken = async () => {
  const res = await instance.post(`/auth/local`, {
    identifier: IDENTIFIER,
    password: PASSWORD,
  });

  return res.data;
};

export const tokenDecrypt = async (token) => {
  const res = await instance.post(`/auth/decrypt`, {
    token: token,
  });

  return res.data;
};

export const GET_OPEN_ORDERS = gql`
  query GET_OPEN_ORDERS {
    orders(where: { type_in: ["buy", "sell"], closeTime_null: true }) {
      id
      ticket
      openTime
      type
      openPrice
      size
      product {
        name
        digits
      }
      stopLoss
      takeProfit
      swap
      profit
    }
  }
`;

export const GET_PENDING_ORDERS = gql`
  query GET_PENDING_ORDERS {
    orders(
      where: {
        type_in: ["sellLimit", "sellStop", "buyLimit", "buyStop"]
        closeTime_null: true
      }
    ) {
      id
      ticket
      openTime
      type
      openPrice
      size
      product {
        name
        digits
      }
      stopLoss
      takeProfit
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS {
    products {
      id
      name
      digits
    }
  }
`;
