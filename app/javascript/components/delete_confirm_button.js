import React, { useState, useEffect, useRef } from 'react'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

export const DeleteConfirmButton = ({id, onDeleteConfirm, message}) => {

  // For popover. See https://mui.com/components/popover/
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (<>
    <button type="button" aria-describedby={`delete-popover-${id}`} className="plain-btn" onClick={(evt) => setAnchorEl(evt.currentTarget)}>
      <img src="/icons/x-lg.svg"/>
    </button>
    <Popover
      id={`delete-popover-${id}`}
      open={anchorEl != null}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'bottom', horizontal: 'right'}}
    >
      <Typography sx={{ p: 2 }}>
        {message}
        <button type="button" className="btn btn-primary" style={{marginLeft: "10px"}} onClick={onDeleteConfirm}>Oui</button>
      </Typography>
    </Popover>
  </>)
}
