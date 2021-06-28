import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useAppDispatch } from 'state';
import { useNetwork } from 'state/hooks';
import { changeNetwork } from 'state/network';

import { networks } from 'config/constants/walletData';
import NetworkItem from '../ConnectPopup/NetworkItem';
import { useStyles } from './styles';

function SwitchNetworkPopup(props) {
  const classes: any = useStyles();
  const { onOpen, onCloseDialog } = props;
  const currentNetwork = useNetwork();
  const dispatch = useAppDispatch();

  const handleNetWorkChange = (item) => {
    dispatch(changeNetwork(item));
    onCloseDialog();
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={onOpen}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>
        <Typography variant="caption" className={classes.dialogTitleText}>
          Switch network
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onCloseDialog}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="1fr 1fr">
          {networks.map((item, index) => (
            <NetworkItem
              key={index}
              icon={item.icon}
              label={item.name}
              onClick={() => handleNetWorkChange(item)}
              selected={currentNetwork.id === item.id}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SwitchNetworkPopup;
