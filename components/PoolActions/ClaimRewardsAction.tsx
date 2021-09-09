import React from "react";
import { Box, CircularProgress } from "@material-ui/core";

import Button from "components/Button";
import { useHarvest } from "hooks/useHarvest";

import { useStyles } from "./styles";

function ClaimRewardsAction(props: any) {
  const classes = useStyles();
  const { disabled, data, onAction = () => {} } = props || {};
  const { requestingContract, id } = data || {};

  const { onReward, isLoading } = useHarvest(requestingContract, id);
  const handleClick = async () => {
    await onReward();
    onAction();
  };

  return (
    <Box>
      <Button className={classes.button} onClick={handleClick} disabled={isLoading || disabled}>
        Claim Rewards
        {isLoading ? (
          <CircularProgress
            size={15}
            classes={{ colorPrimary: classes.colorLoading }}
            style={{ marginLeft: "10px" }}
          />
        ) : null}
      </Button>
    </Box>
  );
}

export default ClaimRewardsAction;
