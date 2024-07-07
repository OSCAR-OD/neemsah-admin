import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MdMoreVert } from "react-icons/md";

const Edit = ({ handleAdd, handleDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <IconButton onClick={handleClick}>
        <MdMoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleAdd}>Add</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default Edit;
