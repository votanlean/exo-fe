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

const StakeDialog = ({
	title,
	open,
	maxAmount = 10,
	unit,
	onClose,
	onConfirm,
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

	const onClickConfirm = async () => {
		setDisbaleButton(true);
		await onConfirm(amount.toString())
		onClose();
		setAmount('');
		setDisbaleButton(false);
	}

	return(
		<Dialog onClose={onCloseDialog} open={open} classes={{ paper: classes.paper }}>
			<DialogTitle className={classes.title}>{title}</DialogTitle>
			<DialogContent>
				<Box my={2}>
					<TextField
						label={title}
						value={amount}
						onChange={onChangeAmount}
						helperText={`Balance: ${unit} ${maxAmount}`}
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

export default StakeDialog;
