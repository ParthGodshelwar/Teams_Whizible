import React, { memo } from "react";
import { Box, IconButton, Drawer, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const MobileLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" height="100vh">
        {/* Top Navbar */}
        <Box
          display="flex"
          alignItems="center"
          // justifyContent="space-between"
          padding="8px 16px"
          bgcolor="#fff"
          color="white"
        >
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon style={{ color: "#757575" }} />
          </IconButton>
          <Typography variant="h6" style={{ color: "#212529" }}>
            My DashBoard
          </Typography>
        </Box>

        {/* Sidebar Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <Box
            width="250px"
            display="flex"
            flexDirection="column"
            padding="16px"
          >
            <Typography variant="h6">Menu</Typography>
            <Typography>Option 1</Typography>
            <Typography>Option 2</Typography>
            <Typography>Option 3</Typography>
          </Box>
        </Drawer>

        {/* Content Area */}
        <Box flexGrow={1} overflow="auto">
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default memo(MobileLayout);
