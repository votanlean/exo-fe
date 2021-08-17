import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  makeStyles,
  Box,
  Typography,
  Button,
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      width: 'auto',
      minWidth: '320px',
      borderRadius: '8px',
      background: theme.palette.themeBg.default,
    },
    label: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 10,
    },
    button: {
      backgroundColor: 'rgb(239, 244, 245)',
      marginRight: 10,
      padding: '7px 15px',
      border: 'none',
      color: '#000000',
    },
    input: {
      marginRight: 5,
    },
    active: {
      backgroundColor: '#007EF3 !important',
      color: '#fff',
    },
    inputTransaction: {
      maxWidth: 100,
      marginRight: 5,
    },
    content: {
      padding: 20,
    },
    dialogTitle: {
      borderBottom: '1px solid rgb(233, 234, 235)',
    },
  };
});

const SettingsDialog = ({ open, onClose }) => {
  const classes: any = useStyles();
  const [slippage, setSlippage] = useState(0.1);
  const [transaction, setTransaction] = useState(20);

  const onCloseDialog = () => {
    onClose();
  };

  const handleSlippageButtonChange = (event, newSlippage) => {
    if (newSlippage !== null) {
      setSlippage(newSlippage);
    }
  };

  const onSlippageChange = (event) => {
    setSlippage(event.target.value);
  };

  const onTransactionChange = (event) => {
    setTransaction(event.target.value);
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
      disableScrollLock
    >
      <DialogTitle className={classes.dialogTitle}>Settings</DialogTitle>
      <DialogContent className={classes.content}>
        <Box marginBottom={5}>
          <Typography className={classes.label}>Slippage tolerance</Typography>
          <Box display="flex" alignItems="center">
            <ToggleButtonGroup
              value={slippage}
              exclusive
              onChange={handleSlippageButtonChange}
            >
              <ToggleButton
                size="small"
                classes={{ root: classes.button, selected: classes.active }}
                value="0.1"
              >
                0.1%
              </ToggleButton>
              <ToggleButton
                size="small"
                classes={{ root: classes.button, selected: classes.active }}
                value="0.5"
              >
                0.5%
              </ToggleButton>
              <ToggleButton
                size="small"
                classes={{ root: classes.button, selected: classes.active }}
                value="1"
              >
                1%
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              size="small"
              variant="outlined"
              placeholder="5%"
              className={classes.input}
              value={slippage}
              onChange={onSlippageChange}
            />
            <Typography variant="body1">%</Typography>
          </Box>
        </Box>

        <Box>
          <Typography className={classes.label}>
            Transaction deadline
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              size="small"
              variant="outlined"
              placeholder="5%"
              className={classes.inputTransaction}
              value={transaction}
              onChange={onTransactionChange}
            />
            <Typography variant="body1">minutes</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
