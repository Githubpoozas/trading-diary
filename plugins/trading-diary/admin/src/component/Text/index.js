import React, { memo } from "react";

import { StyleTypography } from "./style";

export const Text = memo((props) => {
  const { children, color, fontSize, bold, ...rest } = props;

  return (
    <StyleTypography color={color} fontSize={fontSize} bold={bold} {...rest}>
      {children}
    </StyleTypography>
  );
});
