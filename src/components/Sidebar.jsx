import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Cabs", icon: <DirectionsCarIcon />, path: "/cabs" },
    { text: "Events", icon: <EventIcon />, path: "/events" },
    { text: "Popular Places", icon: <PlaceIcon />, path: "/popular-places" },
    { text: "Photo Gallery", icon: <PhotoLibraryIcon />, path: "/photo-gallery" },
    { text: "Maps", icon: <SettingsIcon />, path: "/maps" },
  ];

  return (
    <div className="sidebar">
      <Box className="sidebar-header">
        <AdminPanelSettingsIcon className="sidebar-logo-icon" />
        <Typography variant="h5" className="sidebar-logo">
          Navigation Admin
        </Typography>
      </Box>
      <List className="sidebar-list">
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={Link}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <ListItemIcon className="sidebar-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} className="sidebar-text" />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
