import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Button } from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Navbar.css";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} className="navbar">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" className="navbar-title">
          Dashboard Overview
        </Typography>
        <Box className="navbar-actions">
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: "#3f51b5",
              borderColor: "#3f51b5",
              mr: 2,
              "&:hover": {
                borderColor: "#2c387e",
                backgroundColor: "rgba(63, 81, 181, 0.04)",
              },
            }}
          >
            Logout
          </Button>
          <IconButton size="small" className="profile-button">
            <Avatar className="navbar-avatar">A</Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
