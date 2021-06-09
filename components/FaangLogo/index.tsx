import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles } from '@material-ui/core';

FaangLogo.propTypes = {};

const useStyles = makeStyles((theme) => {
  return {
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      margin: '20px 0px',
    },

    img: {
      height: '40px',
      marginRight: '10px',
      border: '1px solid rgb(161, 169, 214)',
      borderRadius: '24px',
      backgroundColor: '#FFFFFF',
    },
  };
});

function FaangLogo(props) {
  const classes = useStyles();
  return (
    <Box className={classes.logoWrapper}>
      <img src="/static/images/equities/tFB.png" className={classes.img} />
      <img
        src="/static/images/equities/tAAPL-whiteBg.jpeg"
        className={classes.img}
      />
      <img src="/static/images/equities/tAMZN.png" className={classes.img} />
      <img src="/static/images/equities/tNFLX.png" className={classes.img} />
      <img src="/static/images/equities/tGOOGL.png" className={classes.img} />
    </Box>
  );
}

export default FaangLogo;
