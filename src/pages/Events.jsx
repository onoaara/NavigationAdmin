import React, { useEffect, useState } from "react";
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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
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
    } catch (error) {
      console.error("Error adding event: ", error);
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
    } catch (error) {
      console.error("Error deleting event: ", error);
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
      <Grid container spacing={3} className="events-grid" sx={{ mt: 4 }}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card className="event-card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date:{" "}
                  {event.date
                    ? new Date(event.date.seconds * 1000).toLocaleString()
                    : "No date provided"}
                </Typography>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => handleDeleteEvent(event.id)}
                  sx={{ mt: 2 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Events;
