import React from "react";

import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";

export const Progress = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          zIndex: 998,
          backdropFilter: "blur(2px)",
        }}
      ></Box>
      <Box sx={{ zIndex: 999 }}>
        <CircularProgress />
      </Box>
    </Box>
  );
};
