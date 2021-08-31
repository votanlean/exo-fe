import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';
import { useApprove } from 'hooks/useApprove';
import { Box } from '@material-ui/core';

function ApproveToken(props) {
    const classes = useStyles();
    const { symbol, disabled, tokenContract, requestingContract, onApprove } = props;
    const { approve, isLoading } = useApprove({
        tokenContract,
        requestingContract,
        onApprove
    });

    return (
        <div className={disabled ? classes.disable : classes.display} style={{flex: 1}}>
            <Box  >
                <button className="button btn-secondary" onClick={approve}>
                    <span>Approve {symbol}</span>
                </button>
            </Box>
        </div>
    );
}

export default ApproveToken;