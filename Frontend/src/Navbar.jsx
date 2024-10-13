import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogInPop from "./LogInPop";
import { isAuthenticated } from "./ProtectedRoute";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogInOpen, setLogInOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountMenuClick = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    handleAccountMenuClose();
    navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
    } else {
      handleSignOut();
    }
  }, [isLoggedIn]);

  const handleOpenLogIn = () => {
    setLogInOpen(true);
  };

  const handleCloseLogIn = () => {
    setLogInOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "rgb(36, 196, 196)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AgentMaster
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/">
                  Home
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
            </>
          )}
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleAccountMenuClick}>
                <AccountCircleIcon fontSize="large" />
              </Button>
              <Menu
                anchorEl={accountMenuAnchorEl}
                open={Boolean(accountMenuAnchorEl)}
                onClose={handleAccountMenuClose}
              >
                <MenuItem
                  onClick={handleAccountMenuClose}
                  component={Link}
                  to="/dashboard"
                >
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleOpenLogIn}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signin">
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <LogInPop open={isLogInOpen} handleClose={handleCloseLogIn} />
    </>
  );
};

export default Navbar;
