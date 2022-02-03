import axios from "axios";
import { gql } from "@apollo/client";

const instance = axios.create({
  baseURL: API_URI,
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (request) => {
    if (!["/auth/local", "/auth/decrypt"].includes(request.url)) {
      request.headers["authorization"] = `Bearer ${localStorage.getItem(
        "str_token"
      )}`;
    }
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

export const deleteMedia = async (id) => {
  const res = await instance.delete(`/upload/files/${id}`);
  return res.data;
};

export const uploadMedia = async (formData) => {
  const res = await instance.post(`/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createTrade = async (data) => {
  const res = await instance.post("/trades", data);
  return res;
};

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
      type
    }
  }
`;

export const GET_OPEN_TRADE = gql`
  query GET_OPEN_TRADE {
    trades(where: { open: true }) {
      id
      open
      product {
        id
        name
        digits
      }
      type
      comment
      M1 {
        url
      }
      M5 {
        url
      }
      M15 {
        url
      }
      M30 {
        url
      }
      H1 {
        url
      }
      H4 {
        url
      }
      D1 {
        url
      }
      W1 {
        url
      }
      MN {
        url
      }
      orders {
        id
        ticket
        type
        size
        openTime
        stopLoss
        takeProfit
        swap
        profit
        comment
      }
    }
  }
`;
