import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  makeStyles,
  Box,
  Typography,
  Avatar,
  Tooltip,
} from '@material-ui/core';

import { poolToken } from '../../blockchain/tokenFactory';
import { HelpOutline } from '@material-ui/icons';

const useStyles = makeStyles((theme) => {
  const augmentBlue = theme.palette.augmentColor({ main: '#007EF3' });
  return {
    paper: {
      width: '100%',
      maxWidth: '420px',
      borderRadius: '8px',
    },
    inputSearch: {
      width: '100%',
      marginTop: 8,
    },
    poolItem: {
      cursor: 'pointer',
    },
    poolIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    tooltip: {
      maxWidth: 150,
      backgroundColor: '#fff',
      color: '#000',
      boxShadow: 'rgb(47 128 237 / 10%) 0px 4px 8px 0px',
      fontSize: 13,
    },
  };
});

const SelectTokenDialog = ({ title, open, onClose, onConfirm, fromTo }) => {
  const classes: any = useStyles();
  const [poolTokenData, setPoolTokenData] = useState(
    poolToken.sort((a, b) =>
      a.symbol > b.symbol ? 1 : b.symbol > a.symbol ? -1 : 0,
    ),
  );

  // const isDisabled = false && (disableButton || !amount || amount > maxAmount)

  const onCloseDialog = () => {
    onClose();
    setPoolTokenData(poolToken);
  };

  const onSearchTokenChange = (event) => {
    const filter = poolToken.filter((item) =>
      item.symbol.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    setPoolTokenData(filter);
  };

  const onHandlePoolClick = (item) => {
    onConfirm(item);
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>
        <Box display="flex" alignItems="center">
          <Typography variant="caption">Select a Token</Typography>
          <Tooltip
            title="Find a token by searching for its name or symbol or by pasting its address below."
            placement="right"
            classes={{ tooltip: classes.tooltip }}
          >
            <HelpOutline style={{ fontSize: 15, marginLeft: 5 }} />
          </Tooltip>
        </Box>
        <TextField
          id="outlined-basic"
          label="search a token"
          variant="outlined"
          className={classes.inputSearch}
          size="medium"
          onChange={onSearchTokenChange}
        />
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption">Token name</Typography>
        {poolTokenData.map((pool) => (
          <Box
            display="flex"
            alignItems="center"
            height={56}
            onClick={() => onHandlePoolClick(pool)}
            key={pool.id.toString()}
            className={classes.poolItem}
          >
            <Avatar
              alt={pool.title}
              src={pool.icon}
              className={classes.poolIcon}
            />
            <Typography variant="caption">{pool.symbol}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default SelectTokenDialog;
