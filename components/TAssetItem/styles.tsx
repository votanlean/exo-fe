import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 600,
        sm: 769,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return {
    root: {
      background: 'rgb(250, 249, 250)',
      height: '240px',
      maxWidth: '340px',
      margin: '0 auto',
      display: 'block',
      position: 'relative',
      textDecoration: 'none',
    },
    box: {
      gridTemplateRows: 'auto 1fr auto',
      display: 'grid',
      padding: '16px',
      boxSizing: 'border-box',
      height: '100%',
    },
    divide: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '6px',
      background:
        'linear-gradient(88.63deg, rgb(0, 209, 255) -14.83%, rgb(237, 30, 255) 108.22%)',
    },
    symbol: {
      fontWeight: 700,
      color: '#000000',
    },
    priceLabel: {
      fontWeight: 600,
      color: 'rgb(141, 141, 158)',
    },
    price: {
      fontWeight: 600,
      color: '#000000',
    },
    fee: {
      fontWeight: 600,
      color: '#000000',
    },
    status: {
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    dot: {
      width: '10px',
      height: '10px',
      boxShadow: 'rgb(0 209 255 / 50%) 0px 0px 10px',
      marginRight: '8px',
      borderRadius: '50%',
      display: 'block',
    },
    desc: {
      color: '#000000',
    },
  };
});

export { useStyles };
