import axios from "axios";
import { gql } from "@apollo/client";
// import store from "../redux/store";
// import { alertSuccess, alertError } from "../redux/alertSlice";

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
    // store.dispatch(alertError(error.response.data.message));
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

export const closeTrade = async (id) => {
  const res = await instance.put(`/trades/${id}`, { open: false });
  return res;
};

export const reOpenCloseTrade = async (id) => {
  const res = await instance.put(`/trades/${id}`, { open: true });
  return res;
};

export const deleteTrade = async (id) => {
  const res = await instance.delete(`/trades/${id}`);
  return res;
};

export const createTradingUpdate = async (data) => {
  const res = await instance.post(`/trading-updates`, data);
  return res;
};
export const updateTradingUpdate = async (id, data) => {
  const res = await instance.put(`/trading-updates/${id}`, data);
  return res;
};
export const deleteTradingUpdate = async (id) => {
  const res = await instance.delete(`/trading-updates/${id}`);
  return res;
};

export const createOrders = async (data) => {
  const res = await instance.post("/Orders", data);
  return res;
};

export const deleteOrders = async (id) => {
  const res = await instance.delete(`/orders/${id}`);
  return res;
};

export const updateOrders = async (id, data) => {
  const res = await instance.put(`/orders/${id}`, data);
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

export const GET_TRADE = gql`
  query GET_TRADE($open: Boolean!) {
    trades(where: { open: $open }) {
      id
      bias
      createdAt
      updatedAt
      open
      product {
        id
        name
        digits
      }
      comment
      M1 {
        id
        url
      }
      M5 {
        id
        url
      }
      M15 {
        id
        url
      }
      M30 {
        id
        url
      }
      H1 {
        id
        url
      }
      H4 {
        id
        url
      }
      D1 {
        id
        url
      }
      W1 {
        id
        url
      }
      MN {
        id
        url
      }
      trading_updates {
        id
        createdAt
        updatedAt
        comment
        M1 {
          id
          url
        }
        M5 {
          id
          url
        }
        M15 {
          id
          url
        }
        M30 {
          id
          url
        }
        H1 {
          id
          url
        }
        H4 {
          id
          url
        }
        D1 {
          id
          url
        }
        W1 {
          id
          url
        }
        MN {
          id
          url
        }
        trendFollowing
        support
        support
        resistant
        srFlip
        demand
        supply
        fakeout
        fibo
        qml
        iqml
        pa
        orderBlock
      }
      trendFollowing
      support
      support
      resistant
      srFlip
      demand
      supply
      fakeout
      fibo
      qml
      iqml
      pa
      orderBlock
      orders {
        id
        createdAt
        updatedAt
        ticket
        type
        size
        openTime
        closeTime
        openPrice
        closePrice
        stopLoss
        takeProfit
        swap
        profit
        comment
        open
      }
    }
  }
`;
