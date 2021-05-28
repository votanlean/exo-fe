import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	makeStyles,
	Box
} from '@material-ui/core'
import NumberFormat from 'react-number-format';
import { normalizeTokenDecimal } from 'utils/bigNumber';

function calculateDepositFee(amount, depositFeeBP, decimals = 4) {
	return amount * depositFeeBP / Math.pow(10, decimals);
}

const useStyles = makeStyles((theme) => {
	const augmentBlue = theme.palette.augmentColor({ main: '#007EF3' })
	return({
		paper: {
			width: "100%",
			maxWidth: "320px",
			borderRadius: '8px'
		},
		title: {
			background: "#0F0F0F",
			color: 'white'
		},
		footer: {
			padding: "12px 24px"
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
		helperText: {
			textAlign: 'right'
		},
		button: {
			background: augmentBlue.main,
			color: 'white',
			borderRadius: '12px',
			padding: "10px",
			fontSize: "16px",
			fontWeight: 600,
			lineHeight: '1.75',
			width: '100%',
			height: '48px',
			"&:hover": {
				background: augmentBlue.dark
			}
		}
	})
})

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

export const StakeDialog = ({
	title,
	open,
	maxAmount = 10,
	unit,
	onClose,
	onConfirm,
	depositFee,
}) => {
	const classes: any = useStyles();
	const [amount, setAmount] = useState(0);
	const [disableButton, setDisbaleButton] = useState(false);

	const isDisabled = false && (disableButton || !amount || amount > maxAmount)

	const onChangeAmount = (e) => {
		const value = e.target.value;
		if (value >= 0) {
			setAmount(e.target.value);
		} else {
			setAmount(0);
		}
	}

	const onCloseDialog = () => {
		setAmount(0)
		onClose();
	}

	const onClickMax = () => {
		setAmount(normalizeTokenDecimal(maxAmount).toNumber());
	}

	const onClickConfirm = async () => {
		setDisbaleButton(true);
		await onConfirm(amount.toString())
		onClose();
		setAmount(0);
		setDisbaleButton(false);
	}

	return(
		<Dialog onClose={onCloseDialog} open={open} classes={{ paper: classes.paper }}>
			<DialogTitle className={classes.title}>
				<div className={classes.titleContainer}>
					<p>{title}</p>
					<div
						className={classes.maxButton}
						onClick={onClickMax}
					>
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
						helperText={`Balance: ${unit} ${normalizeTokenDecimal(maxAmount)}. \n Deposit fee: ${calculateDepositFee(amount, depositFee)} ${unit}`}
						fullWidth
						placeholder={unit}
						FormHelperTextProps={{
							className: classes.helperText
						}}
						InputProps={{
							inputComponent: NumberFormatCustom,
							inputProps: {
								unit
							}
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions className={classes.footer}>
				<Button
					onClick={onClickConfirm}
					variant="contained"
					disabled={isDisabled}
					className={classes.button}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	)
}
