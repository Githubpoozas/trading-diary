import React, { memo } from "react";

import { StyleMainLayout } from "./style";

const MainLayout = (props) => {
  return <StyleMainLayout>{props.children}</StyleMainLayout>;
};

export default memo(MainLayout);
