import { createMuiTheme } from '@material-ui/core/styles';

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    headerBg: Palette['background'];
    themeBg: Palette['background'];
    tableRowBg: Palette['background'];
    textColor: Palette['background'];
  }
  interface PaletteOptions {
    headerBg: PaletteOptions['background'];
    themeBg: PaletteOptions['background'];
    tableRowBg: PaletteOptions['background'];
    textColor: PaletteOptions['background'];
  }
}

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: '#08060B',
    },
    headerBg: {
      default: "#27262c"
    },
    themeBg: {
      default: "#27262c"
    },
    tableRowBg: {
      default: "#1E1D20"
    },
    textColor: {
      default: "#ffffff"
    }
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {},
    headerBg: {
      default: "#0f0f0f"
    },
    themeBg: {
      default: "#ffffff"
    },
    tableRowBg: {
      default: "#faf9fa"
    },
    textColor: {
      default: "#000000"
    }
  },
});

export { darkTheme, lightTheme };
