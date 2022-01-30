/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { NotFound } from "strapi-helper-plugin";
import dayjs from "dayjs";
import _ from "lodash";
import { ThemeProvider } from "@mui/material/styles";
import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import LinearProgress from "@mui/material/LinearProgress";

// Utils
import pluginId from "../../pluginId";
// Containers
import HomePage from "../HomePage";

// Theme
import theme from "../../theme";

import MainLayout from "../../component/MainLayout/index";

import { getToken, tokenDecrypt } from "../../services";

/* ---------- Apollo Client ---------- */
const httpLink = createHttpLink({
  uri: `${strapi.backendURL}/graphql`,
  // uri: `http://localhost:1337/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const jwt = localStorage.getItem("str_token");
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${jwt}`,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const App = () => {
  const [validToken, setValidToken] = useState(false);

  const handleGetToken = async () => {
    try {
      const res = await getToken();
      if (res.jwt) {
        localStorage.setItem("str_token", res.jwt);
        setValidToken(true);
      } else {
        throw new Error(res);
      }
    } catch (error) {
      console.log("getToken error: ", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const jwt = localStorage.getItem("str_token");
      if (!_.isNull(jwt)) {
        try {
          const res = await tokenDecrypt(jwt);

          // check token expired date
          if (dayjs(res.exp * 1000).isAfter(dayjs(), "date")) {
            setValidToken(true);
          }
        } catch (error) {
          console.log("VerifyToken error: ", error.message);
          setValidToken(false);
        }
      } else {
        handleGetToken();
      }
    };

    verifyToken();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <MainLayout>
          {validToken ? (
            <Switch>
              <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
              <Route component={NotFound} />
            </Switch>
          ) : (
            <LinearProgress />
          )}
        </MainLayout>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
