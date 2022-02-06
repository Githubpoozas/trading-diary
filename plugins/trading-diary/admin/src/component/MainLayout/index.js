import React, { memo, useState, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useSnackbar } from "notistack";

import pluginId from "../../pluginId";

import {
  StyleMainLayout,
  StyledBottomNavigation,
  StyledBottomNavigationAction,
} from "./style";

const routes = [
  {
    label: "Home",
    icon: MonetizationOnIcon,
    path: `/plugins/${pluginId}`,
  },
  {
    label: "Add",
    icon: AddCircleOutlineIcon,
    path: `/plugins/${pluginId}/add`,
  },
  {
    label: "History",
    icon: ListAltIcon,
    path: `/plugins/${pluginId}/history`,
  },
];

const MainLayout = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();
  const location = useLocation();
  const alert = useSelector((state) => state.alert);

  const [value, setValue] = useState(0);

  const handleRouteChange = (value) => {
    setValue(value);
    history.push(routes[value].path);
  };

  useEffect(() => {
    if (alert.content !== "") {
      enqueueSnackbar(alert.content, { variant: alert.variant });
    }
  }, [alert]);

  useEffect(() => {
    setValue(routes.findIndex((r) => r.path === location.pathname));
  }, [location]);

  return (
    <StyleMainLayout>
      <StyledBottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          handleRouteChange(newValue);
        }}
      >
        {routes.map((r) => (
          <StyledBottomNavigationAction
            key={r.label}
            label={r.label}
            icon={<r.icon />}
          />
        ))}
      </StyledBottomNavigation>
      {props.children}
    </StyleMainLayout>
  );
};

export default memo(MainLayout);
