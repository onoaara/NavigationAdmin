import React from "react";
import { Link } from "react-router-dom";
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
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Box className="sidebar-header">
        <Typography variant="h5" className="sidebar-logo">
          Admin
        </Typography>
      </Box>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/cabs">
          <ListItemIcon>
            <DirectionsCarIcon />
          </ListItemIcon>
          <ListItemText primary="Cabs" />
        </ListItem>
        <ListItem button component={Link} to="/events">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
        <ListItem button component={Link} to="/popular-places">
          <ListItemIcon>
            <PlaceIcon />
          </ListItemIcon>
          <ListItemText primary="Popular Places" />
        </ListItem>
        <ListItem button component={Link} to="/photo-gallery">
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Photo Gallery" />
        </ListItem>
        <ListItem button component={Link} to="/maps">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Maps" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
