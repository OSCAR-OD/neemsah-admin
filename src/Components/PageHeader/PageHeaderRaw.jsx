import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { AiOutlineFileAdd } from "react-icons/ai";

function PageHeaderRaw({ title, buttonText1, buttonText2, icon, handleAddClick, handleAddClick2 }) {
  return (
    <>
      <Stack 
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        spacing={2}
      >
        <Typography variant="modalTitle">{title}</Typography>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button variant="contained" startIcon={icon} onClick={handleAddClick}>
            {buttonText1}
          </Button>
          <Button variant="contained" startIcon={icon} onClick={handleAddClick2}>
            {buttonText2}
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />
    </>
  );
}

PageHeaderRaw.defaultProps = {
  title: "Add Title",
  buttonText1: "Add New",
  buttonText2: "Select",
  icon: <AiOutlineFileAdd />,
};

export default PageHeaderRaw;