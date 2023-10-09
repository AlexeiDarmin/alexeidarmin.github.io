import { createTheme } from "@mui/material";
import { amber, blue, blueGrey, common, deepOrange, green, grey, orange, red } from "@mui/material/colors";

export const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  palette: {
    primary: {
      main: grey[900],
      contrastText: green[900]
    },
    secondary: {
      main: common.black
    }
  },
  typography: {
    button: {
      textTransform: 'none',
      // fontWeight: 100,
      // fontSize: '1rem'
    }
  },
});