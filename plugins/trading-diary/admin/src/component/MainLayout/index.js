import React, { memo, useState } from "react";
import { useHistory } from "react-router-dom";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

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
  const history = useHistory();
  const [value, setValue] = useState(0);

  const handleRouteChange = (value) => {
    setValue(value);
    history.push(routes[value].path);
  };

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
