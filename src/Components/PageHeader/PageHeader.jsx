import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { AiOutlineFileAdd } from "react-icons/ai";

function PageHeader({ title, buttonText, icon, handleAddClick }) {
  return (
    <>
      <Stack justifyContent={"space-between"} flexWrap={"wrap"} gap={1.5}>
        <Typography variant="modalTitle">{title} </Typography>
        <Button variant="contained" startIcon={icon} onClick={handleAddClick}>
          {buttonText}
        </Button>
      </Stack>
      <Divider sx={{ mt: 2 }} />
      
    </>
  );
}
PageHeader.defaultProps = {
  title: "Add Title",
  buttonText: "Add New",
  icon: <AiOutlineFileAdd />,
};

export default PageHeader;
