import React from "react";
import {
    Backdrop, makeStyles
} from "@material-ui/core";

import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    positionAbsolute: {
        position: 'absolute'
    },
  }));

function OverLay(props: any) {
    const { positionAbsolute, backgroundColor = "transparent", isLoading, open } = props;
    const classes = useStyles();
    return (
        <>
            <Backdrop style={{backgroundColor}} className={`${classes.backdrop} ${positionAbsolute ? classes.positionAbsolute : null} `} open={open}>
                {isLoading ? <CircularProgress color="inherit" /> : null}
            </Backdrop>
        </>
    );
}

export default OverLay;
