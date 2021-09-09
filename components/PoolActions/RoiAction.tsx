import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { ROIDialog } from 'components/Dialogs';

function RoiAction(props: any) {
  const { apr, tokenPrice, autocompound, DialogComponent = ROIDialog } = props || {};
  const [openRoiDialog, setOpenRoiDialog] = useState(false);

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog);
  };

  return (
    <>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={onToggleRoiDialog}
      >
        <img
          src="/static/images/calculate.svg"
          style={{ width: 20, height: 20 }}
        />
      </IconButton>
      <DialogComponent
        open={openRoiDialog}
        onClose={onToggleRoiDialog}
        poolData={{ apr, tokenPrice, autocompound }}
      />
    </>
  );
}

export default RoiAction;
