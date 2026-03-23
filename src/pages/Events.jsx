import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEventsData();
  }, []);

  const handleAddEvent = async () => {
    try {
      const eventsCollection = collection(db, "events");
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      await addDoc(eventsCollection, {
        name: eventName,
        date: Timestamp.fromDate(eventDateTime),
      });
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
      setEventName("");
      setEventDate("");
      setEventTime("");
      toast.success("Event added successfully!");
    } catch (error) {
      console.error("Error adding event: ", error);
      toast.error("Error adding event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event: ", error);
      toast.error("Error deleting event");
    }
  };

  return (
    <div className="events-page">
      <h2>Events</h2>
      <Box
        className="event-form"
        component="form"
        noValidate
        autoComplete="off"
      >
        <Typography variant="h6">Add Event</Typography>
        <TextField
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Event Date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Event Time"
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEvent}
          sx={{ mt: 2 }}
        >
          Add Event
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }} elevation={0}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell sx={{ fontWeight: "bold" }}>{event.name}</TableCell>
                <TableCell>
                  {event.date
                    ? new Date(event.date.seconds * 1000).toLocaleString()
                    : "No date provided"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Events;
