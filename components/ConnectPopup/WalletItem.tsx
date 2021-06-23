import { Button, Typography, Avatar } from '@material-ui/core';
import { useStyles } from './styles';

interface Props {
  icon: string;
  label: string;
  disabled?: boolean;
  iconDisable?: string;
  onClick?: () => void;
}

function WalletItem(props: Props) {
  const { icon = '', label = '', disabled = false, onClick } = props || {};
  const classes = useStyles();

  return (
    <Button
      classes={{ root: classes.buttonWalletRoot, label: classes.buttonLabel }}
      disabled={disabled}
      onClick={onClick}
    >
      <Avatar
        src={icon}
        className={`${classes.iconWallet} ${
          disabled ? classes.iconDisable : null
        }`}
      />
      <Typography
        classes={{ root: classes.labelWallet }}
        className={disabled ? classes.labelDisable : null}
      >
        {label}
      </Typography>
    </Button>
  );
}

export default WalletItem;
