import { useEffect, useRef, useState, memo } from "react";
import { useMediaQuery, Box, styled, useTheme, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Scrollbar from "react-perfect-scrollbar";
import { Outlet } from "react-router-dom";

import useSettings from "app/hooks/useSettings";
import Layout1Sidenav from "./Layout1Sidenav";
// import Layout1MobileSidenav from "./Layout1MobileSidenav";
import Footer from "app/components/Footer";
import { WhizSuspense } from "app/components";
import SidenavTheme from "app/components/WhizTheme/SidenavTheme/SidenavTheme";

import { sidenavCompactWidth, sideNavWidth } from "app/utils/constant";
import Layout1SidenavMobile from "./Layout1SidenavMobile";



// STYLED COMPONENTS
const Layout1Root = styled(Box)(({ theme }) => ({
  display: "flex",
  background: theme.palette.background.default
}));

const ContentBox = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflowY: "auto",
  overflowX: "hidden",
  flexDirection: "column",
  justifyContent: "space-between"
}));

const StyledScrollBar = styled(Scrollbar)(() => ({
  height: "100%",
  position: "relative",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column"
}));

const LayoutContainer = styled(Box)(({ width, open }) => ({
  height: "100vh",
  display: "flex",
  flexGrow: "1",
  flexDirection: "column",
  verticalAlign: "top",
  marginLeft: width,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  marginRight: open ? 50 : 0
}));

const FloatingMenuButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  top: 15,
  left: 15,
  zIndex: 1300,
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark
  }
}));

const Layout1 = () => {
  const [activeNav, setActiveNav] = useState("/landingpage"); // Track the active navigation
  const { settings, updateSettings } = useSettings();
  const { layout1Settings, secondarySidebar } = settings;

  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav }
  } = layout1Settings;

  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile sidebar

  const getSidenavWidth = () => {
    switch (sidenavMode) {
      case "full":
        return sideNavWidth;
      case "compact":
        return sidenavCompactWidth;
      default:
        return "0px";
    }
  };

  const sidenavWidth = getSidenavWidth();
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const ref = useRef({ isMdScreen, settings });

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? "close" : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } });
    }
  }, [isMdScreen]);

  return (
    <Layout1Root>
      {/* {isMdScreen ? (
        <Layout1MobileSidenav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      ) : (
        showSidenav &&
        sidenavMode !== "close" && (
          <SidenavTheme>
            <Layout1Sidenav />
          </SidenavTheme>
        )
      )} */}
      {/* ✅ Floating Hamburger Button (Only for Mobile) - Hidden when Sidebar is Open */}
      {isMdScreen && !mobileOpen && (
        <FloatingMenuButton onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </FloatingMenuButton>
      )}
      {/* ✅ Sidebar (Desktop) */}
      {!isMdScreen && showSidenav && sidenavMode !== "close" && (
        <SidenavTheme>
          <Layout1Sidenav />
        </SidenavTheme>
      )}
      {/* ✅ Sidebar (Mobile) - Opens in Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)} // Clicking outside also closes the sidebar
        PaperProps={{
          sx: { width: 250, position: "relative" } // Sidebar width
        }}
      >
        <SidenavTheme>
          <IconButton
            onClick={() => setMobileOpen(false)}
            keepMounted
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#000"
            }} 
          >
            <Layout1SidenavMobile activeNav={activeNav} setActiveNav={setActiveNav} />
          </IconButton>
          <CloseIcon />
        </SidenavTheme>
      </Drawer>
      {/* ✅ Main Content */}
      <LayoutContainer width={isMdScreen ? 0 : sidenavWidth} open={secondarySidebar.open}>
        {settings.perfectScrollbar ? (
          <StyledScrollBar>
            <Box flexGrow={1} position="relative">
              <WhizSuspense>
                <Outlet />
              </WhizSuspense>
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </StyledScrollBar>
        ) : (
          <ContentBox>
            <Box flexGrow={1} position="relative">
              <WhizSuspense>
                <Outlet />
              </WhizSuspense>
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </ContentBox>
        )}
      </LayoutContainer>
    </Layout1Root>
  );
};

export default memo(Layout1);
