import { Button, Typography, Avatar, Box } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { useStyles } from './styles';

interface Props {
  icon: string;
  label: string;
  disabled?: boolean;
  iconDisable?: string;
  onClick?: () => void;
  selected: boolean;
}

function NetworkItem(props: Props) {
  const {
    icon = '',
    label = '',
    disabled = false,
    onClick,
    selected,
  } = props || {};
  const classes = useStyles();

  return (
    <Button
      classes={{ root: classes.buttonWalletRoot, label: classes.buttonLabel }}
      disabled={disabled}
      onClick={onClick}
    >
      <Box position="relative">
        <Avatar
          src={icon}
          className={`${classes.iconWallet} ${
            disabled ? classes.iconDisable : null
          }`}
        />
        {selected ? (
          <Box className={classes.iconCheckContainer}>
            <Check
              fontSize="small"
              color="primary"
              classes={{
                root: !disabled ? classes.iconCheck : classes.iconCheckDisable,
                fontSizeSmall: classes.iconCheckSize,
              }}
            />
          </Box>
        ) : null}
      </Box>
      <Typography
        classes={{ root: classes.labelWallet }}
        className={disabled ? classes.labelDisable : null}
      >
        {label}
      </Typography>
    </Button>
  );
}

export default NetworkItem;
