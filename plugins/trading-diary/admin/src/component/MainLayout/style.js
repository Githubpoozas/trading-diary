import { styled } from "@mui/system";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export const StyleMainLayout = styled("div")(({ theme }) => ({
  padding: "20px 20px 50px 20px",
}));

export const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: "10px",
  borderRadius: "5px",
  zIndex: "1000",
  overflow: "hidden",
  border: `1px solid ${theme.palette.primary.main}`,
}));

export const StyledBottomNavigationAction = styled(BottomNavigationAction)(
  ({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  })
);
