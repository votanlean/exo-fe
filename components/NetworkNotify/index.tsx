import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './style';
import { useNetwork } from 'state/hooks';
import { useWeb3React } from '@web3-react/core';
import { Button, Link, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { networks } from 'config/constants/walletData';
import { changeNetwork } from 'state/network';
import { useAppDispatch } from 'state';
index.propTypes = {
    clickHandle: PropTypes.func,
};


function index(props) {
    const {clickHandle} = props;
    const appNetwork = useNetwork();
    const { library, connector } = useWeb3React();
    const classes = useStyles();
    const [change, setChange] = useState(false);
    const handleNetWorkChange = (item) => {
        dispatch(changeNetwork(item));
      };
    const dispatch = useAppDispatch();
    useEffect(()=>{
        networks.map((p)=>{
            if(p.id === parseInt(library?.networkVersion)){
                dispatch(changeNetwork(p));
            }
        });
        setChange(true);
    },[library?.networkVersion]);
    
    
    if((appNetwork.id !== parseInt(library?.networkVersion)) && (typeof library?.networkVersion !== "undefined") ){
        return (
            <div className={classes.notify}>
                <Typography className={classes.p}>
                    App network ({appNetwork.id}) doesn't match to network selected in wallet: {library?.networkVersion}. Please change your wallet network or
                </Typography>
                <Button className={classes.button} onClick={clickHandle}> 
                    Change App network
                </Button>   
            </div>
        );
    }else{
        return (<></>);
    }
}

export default index;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}