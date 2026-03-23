import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Maps.css";

const Maps = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "locations"), {
        name,
        coordinates: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
      });

      setName("");
      setLatitude("");
      setLongitude("");
      toast.success("Location added successfully!");
      fetchLocations();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding location");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await updateDoc(doc(db, "locations", currentLocation.id), {
        name: currentLocation.name,
        coordinates: {
          lat: parseFloat(currentLocation.coordinates.lat),
          lng: parseFloat(currentLocation.coordinates.lng),
        },
      });

      setOpen(false);
      setCurrentLocation(null);
      toast.success("Location updated successfully!");
      fetchLocations();
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Error updating location");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "locations", id));
      toast.success("Location deleted successfully!");
      fetchLocations();
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error deleting location");
    }
  };

  const fetchLocations = async () => {
    const querySnapshot = await getDocs(collection(db, "locations"));
    const fetchedLocations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLocations(fetchedLocations);
  };

  const handleEdit = (location) => {
    setCurrentLocation(location);
    setOpen(true);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <Box className="maps-container">
      <Typography variant="h4" className="maps-title">
        Add New Location
      </Typography>
      <Paper component="form" className="maps-form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
          type="number"
          inputProps={{ step: "any" }}
          fullWidth
        />
        <TextField
          label="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
          type="number"
          inputProps={{ step: "any" }}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="maps-button"
        >
          Save Location
        </Button>
      </Paper>
      <Box className="locations-list">
        <Typography variant="h5" className="list-title">
          Locations List
        </Typography>
        <TableContainer component={Paper} elevation={0} className="locations-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id} hover>
                  <TableCell fontWeight="bold">{location.name}</TableCell>
                  <TableCell>{location.coordinates?.lat || "N/A"}</TableCell>
                  <TableCell>{location.coordinates?.lng || "N/A"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(location)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(location.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the location details below.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Name"
            value={currentLocation?.name || ""}
            onChange={(e) =>
              setCurrentLocation({ ...currentLocation, name: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            label="Latitude"
            value={currentLocation?.coordinates?.lat || ""}
            onChange={(e) =>
              setCurrentLocation({
                ...currentLocation,
                coordinates: {
                  ...currentLocation.coordinates,
                  lat: e.target.value,
                },
              })
            }
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Longitude"
            value={currentLocation?.coordinates?.lng || ""}
            onChange={(e) =>
              setCurrentLocation({
                ...currentLocation,
                coordinates: {
                  ...currentLocation.coordinates,
                  lng: e.target.value,
                },
              })
            }
            type="number"
            inputProps={{ step: "any" }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Maps;
