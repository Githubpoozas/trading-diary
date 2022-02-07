import React from "react";

import { Text } from "../index";

export const NoInformation = ({ height }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: height ? height : "120px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text bold="true">No Information</Text>
    </div>
  );
};
