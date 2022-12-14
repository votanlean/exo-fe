import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  makeStyles,
  Box,
  CircularProgress,
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import Button from 'components/Button';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

const useStyles = makeStyles((theme) => {
  const augmentBlue = theme.palette.augmentColor({ main: '#007EF3' });
  return {
    paper: {
      width: '100%',
      maxWidth: '320px',
      borderRadius: '8px',
    },
    title: {
      background: '#0F0F0F',
      color: 'white',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    maxButton: {
      display: 'flex',
      border: '1px solid white',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60px',
      cursor: 'pointer',
    },
    footer: {
      padding: '12px 24px',
    },
    helperText: {
      textAlign: 'right',
    },
    button: {
      background: augmentBlue.main,
      color: 'white',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '1.75',
      width: '100%',
      height: '48px',
      '&:hover': {
        background: augmentBlue.dark,
      },
    },
  };
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, unit, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix={`${unit} `}
    />
  );
}

export const WithdrawDialog = (props: any) => {
  const {
    title,
    open,
    maxAmount = 10,
    unit,
    onClose,
    onConfirm,
    isLoading,
    decimals,
  } = props || {};
  const classes: any = useStyles();
  const [amount, setAmount] = useState(0);
  const [disableButton, setDisbaleButton] = useState(false);

  const isDisabled = false && (disableButton || !amount || amount > maxAmount);
  const { id: chainId } = useNetwork();
  const decimal = getDecimals(decimals, chainId);

  const onChangeAmount = (e) => {
    const value = e.target.value;
    // const maxAmountConverted = normalizeTokenDecimal(maxAmount, +decimal).toFixed(+decimal, 1);
    if (value >= 0) {
      setAmount(value);
      // if (value >= maxAmountConverted) {
      //   setAmount(maxAmountConverted);
      // }
    } else {
      setAmount(0);
    }
  };

  const onCloseDialog = () => {
    setAmount(0);
    onClose();
  };

  const onClickMax = () => {
    setAmount(normalizeTokenDecimal(maxAmount, +decimal).toFixed(+decimal, 1));
  };

  const onClickConfirm = async () => {
    setDisbaleButton(true);
    await onConfirm(amount.toString());
    onClose();
    setAmount(0);
    setDisbaleButton(false);
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>
        <div className={classes.titleContainer}>
          <p>{title}</p>
          <div className={classes.maxButton} onClick={onClickMax}>
            <p>MAX</p>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          <TextField
            label={title}
            value={amount}
            onChange={onChangeAmount}
            helperText={`Balance: ${unit} ${normalizeTokenDecimal(maxAmount, +decimal)}`}
            fullWidth
            placeholder={unit}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: {
                unit,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button
          onClick={onClickConfirm}
          variant="contained"
          disabled={isDisabled || isLoading}
          className={classes.button}
        >
          Confirm
          {isLoading ? (
            <CircularProgress
              size={15}
              classes={{ colorPrimary: classes.colorLoading }}
              style={{ marginLeft: '10px' }}
            />
          ) : null}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
